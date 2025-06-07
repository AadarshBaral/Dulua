"use client"

import { Button } from "@components/ui/button"
import { Input } from "@components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import React from "react"
import { forgotpasswordSchema, ForgotPasswordInputs } from "@lib/validations"

function ForgotPasswordForm() {
    const router = useRouter()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordInputs>({
        resolver: zodResolver(forgotpasswordSchema),
    })

    const onSubmit = async (data: ForgotPasswordInputs) => {
        router.push("/auth/verifyCode")
    }

    return (
        <div className="h-auto flex items-center justify-center border-2 border-border p-[28px] rounded-xl shadow-sm w-full max-w-md">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-7 w-full"
            >
                <div className="cont flex justify-center items-center flex-col gap-2">
                    <h1 className="text-2xl font-semibold text-primary text-center">
                        Forgot Password
                    </h1>
                    <p className="text-[var(--input-text)] text-center ">
                        Enter the email associated <br /> with your accoun
                    </p>
                </div>

                <div>
                    <Input
                        type="email"
                        label="Email"
                        placeholder="Enter Email Here"
                        {...register("email")}
                    />
                    {errors.email && (
                        <p className="text-sm text-red-500 mt-1">
                            {errors.email.message}
                        </p>
                    )}
                </div>
                <Button type="submit">Continue</Button>
            </form>
        </div>
    )
}

export default ForgotPasswordForm
