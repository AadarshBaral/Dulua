"use client"

import React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"

import { InputOTP, InputOTPGroup, InputOTPSlot } from "@components/ui/input-otp"
import { Button } from "@components/ui/button"
import { OtpFormInputs, otpSchema } from "@lib/validations"

const VerifyCodeForm = ({ verifyCodeEnd }: { verifyCodeEnd: () => void }) => {
    const router = useRouter()

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
    const onSubmit = (data: OtpFormInputs) => {
        console.log("OTP Code:", data.code)
        router.push("/auth/changePassword")
    }

    const [codeResetTimeout, setCodeResetTimeout] = React.useState(60)

    return (
        <div className="h-auto flex items-center justify-center border-2 border-border p-[28px] rounded-xl shadow-sm w-full max-w-md">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-6 w-full"
            >
                <div className="cont flex justify-center items-center flex-col gap-2">
                    <h1 className="text-2xl font-semibold text-primary text-center">
                        Verify Code
                    </h1>
                    <p className="text-[var(--input-text)] text-center">
                        Please enter the 4 digit code that was sent to you via
                        email
                    </p>
                </div>

                <div className="otp flex justify-center items-center flex-col gap-[22px]">
                    <InputOTP
                        maxLength={4}
                        value={code}
                        onChange={(value) => setValue("code", value)}
                    >
                        <InputOTPGroup className="gap-4 justify-center">
                            <InputOTPSlot
                                className="border-2 border-primary"
                                index={0}
                            />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                        </InputOTPGroup>
                    </InputOTP>

                    {errors.code && (
                        <p className="text-sm text-red-500 mt-1">
                            {errors.code.message}
                        </p>
                    )}

                    <p>
                        Resend code in{" "}
                        <span className="text-primary text-center">
                            {codeResetTimeout}
                        </span>{" "}
                        seconds
                    </p>
                </div>

                <Button onClick={verifyCodeEnd} type="submit">
                    Confirm Code
                </Button>
            </form>
        </div>
    )
}

export default VerifyCodeForm
