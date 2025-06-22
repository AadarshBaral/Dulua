"use client"

import React, { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"

import { InputOTP, InputOTPGroup, InputOTPSlot } from "@components/ui/input-otp"
import { Button } from "@components/ui/button"
import { OtpFormInputs, otpSchema } from "@lib/validations"
import { Step } from "../authLayout"
import { verifyOtp } from "@api/auth"

const VerifyCodeForm = ({
    verifyCodeEnd,
    changePageState,
}: {
    verifyCodeEnd: () => void
    changePageState: (state: Step) => void
}) => {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [codeResetTimeout, setCodeResetTimeout] = useState(60)

    const {
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<OtpFormInputs>({
        resolver: zodResolver(otpSchema),
        defaultValues: { code: "" },
    })

    const code = watch("code")

    const onSubmit = async (data: OtpFormInputs) => {
        setLoading(true)
        const email = localStorage.getItem("email")
        if (email != null) {
            const response = await verifyOtp({ email, otp: data.code })
            console.log(response)
            if (response.status === 200) {
                changePageState("login")
            } else {
                console.error("OTP verification failed", response.data)
            }
        } else {
            console.error("email not found")
        }
        setLoading(false)
    }

    useEffect(() => {
        if (codeResetTimeout <= 0) return
        const interval = setInterval(() => {
            setCodeResetTimeout((prev) => prev - 1)
        }, 1000)
        return () => clearInterval(interval)
    }, [codeResetTimeout])

    return (
        <div className="h-auto flex items-center justify-center rounded-xl w-full">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-8 w-full"
            >
                <div className="intro flex flex-col gap-2">
                    <div className="logo flex justify-center items-center rounded-xl border-2 border-gray-100 text-gray-300 p-4 h-[70px] w-[70px]">
                        Logo
                    </div>
                    <p className="text-3xl font-bold break-words max-w-sm">
                        Verify Code
                    </p>
                    <p>
                        {" "}
                        Please enter the 4 digit code that was sent to you via
                        email
                    </p>
                </div>

                <div className="flex flex-col gap-2">
                    <InputOTP
                        maxLength={4}
                        value={code}
                        onChange={(value) => setValue("code", value)}
                    >
                        <InputOTPGroup className="gap-4 justify-center">
                            <InputOTPSlot
                                className="border-2 rounded-lg border-neutral-600/60"
                                index={0}
                            />
                            <InputOTPSlot
                                index={1}
                                className="border-2 rounded-lg border-neutral-600/60"
                            />
                            <InputOTPSlot
                                index={2}
                                className="border-2 rounded-lg border-neutral-600/60"
                            />
                            <InputOTPSlot
                                index={3}
                                className="border-2 rounded-lg border-neutral-600/60"
                            />
                        </InputOTPGroup>
                    </InputOTP>

                    {errors.code && (
                        <p className="text-sm text-red-500 mt-1">
                            {errors.code.message}
                        </p>
                    )}
                    <p className="text-sm text-gray-500 mt-1">
                        Resend code in{" "}
                        <span className="text-primary text-center">60</span>{" "}
                        seconds
                    </p>
                </div>
                <Button
                    size="lg"
                    onClick={verifyCodeEnd}
                    type="submit"
                    disabled={loading}
                >
                    {loading ? (
                        <div className="flex items-center gap-2">
                            <span className="animate-spin rounded-full h-4 w-4 border-2 border-t-transparent border-white"></span>
                            Verifying...
                        </div>
                    ) : (
                        "Confirm Code"
                    )}
                </Button>
            </form>
        </div>
    )
}

export default VerifyCodeForm
