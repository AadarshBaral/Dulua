"use client"

import { Button } from "@components/ui/button"
import { Input } from "@components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import React from "react"
import { ChangePasswordInputs, ChangePasswordSchema } from "@lib/validations"

function ChangePasswordForm() {
    const router = useRouter()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ChangePasswordInputs>({
        resolver: zodResolver(ChangePasswordSchema),
    })

    const onSubmit = async (data: ChangePasswordInputs) => {
        router.push("/auth/login")
    }

    return (
        <div className="h-auto flex items-center justify-center border-2 border-border p-[28px] rounded-xl shadow-sm w-full max-w-md">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-6 w-full"
            >
                <h1 className="text-2xl font-semibold text-primary text-center">
                    Change Password
                </h1>

                <div>
                    <Input
                        type="password"
                        label="Password"
                        placeholder="Enter Password Here"
                        {...register("password")}
                    />
                    {errors.password && (
                        <p className="text-sm text-red-500 mt-1">
                            {errors.password.message}
                        </p>
                    )}
                </div>

                <div>
                    <Input
                        type="password"
                        label="Confirm Password"
                        placeholder="Confirm Password Here"
                        {...register("confirmPassword")}
                    />
                    {errors.confirmPassword && (
                        <p className="text-sm text-red-500 mt-1">
                            {errors.confirmPassword.message}
                        </p>
                    )}
                </div>

                <Button type="submit">Change Password</Button>
            </form>
        </div>
    )
}

export default ChangePasswordForm
