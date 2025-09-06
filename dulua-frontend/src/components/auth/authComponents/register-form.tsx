"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@components/ui/button"
import { Input } from "@components/ui/input"
import { RegisterFormInputs, registerSchema } from "@lib/validations"
import { Step } from "../authLayout"
import { registerUser } from "@api/auth"

function RegisterForm({
    registerEnd,
    changePageState,
}: {
    registerEnd: () => void
    changePageState: (state: Step) => void
}) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormInputs>({
        resolver: zodResolver(registerSchema),
    })

    const onSubmit = async (data: RegisterFormInputs) => {
        setLoading(true)
        const response = await registerUser({ data })
        localStorage.setItem("email", data.email)
        if (response.status === 200) {
            changePageState("verifyCode")
        } else {
            console.error("Registration failed", response.data)
        }
        setLoading(false)
    }

    return (
        <div className="h-auto flex items-center justify-center rounded-xl w-full">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-4 w-full"
            >
                <div className="intro flex flex-col gap-2">
                    <div className="logo flex justify-center items-center rounded-xl border-2 border-gray-100 text-gray-300 p-4 h-[70px] w-[70px]">
                        Logo
                    </div>
                    <p className="text-3xl font-bold break-words max-w-sm">
                        Join Dulua
                    </p>
                </div>

                <div className="flex flex-col gap-2">
                    <Input
                        type="text"
                        label="Username"
                        placeholder="Enter Username Here"
                        {...register("username")}
                    />
                    {errors.username && (
                        <p className="text-sm text-red-500 mt-1">
                            {errors.username.message}
                        </p>
                    )}

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

                <Button onClick={registerEnd} type="submit" disabled={loading}>
                    {loading ? (
                        <div className="flex items-center gap-2">
                            <span className="animate-spin rounded-full h-4 w-4 border-2 border-t-transparent border-white"></span>
                            Registering...
                        </div>
                    ) : (
                        "Register"
                    )}
                </Button>

                <div className="line w-full bg-border h-[1px]" />

                <div className="text-center flex items-center justify-center gap-1 text-sm text-[var(--input-text)]">
                    <p>Already have an account?</p>
                    <p
                        onClick={() => changePageState("login")}
                        className="text-accent cursor-pointer"
                    >
                        Login
                    </p>
                    instead
                </div>
            </form>
        </div>
    )
}

export default RegisterForm
