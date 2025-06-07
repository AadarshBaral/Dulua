"use client"

import { Button } from "@components/ui/button"
import { Input } from "@components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import React from "react"
import {
    forgotpasswordSchema,
    ForgotPasswordInputs,
    LoginFormInputs,
    loginSchema,
} from "@lib/validations"
import { Step } from "../authLayout"

function LoginForm({
    loginEnd,
    changePageState,
}: {
    loginEnd: () => void
    changePageState: (state: Step) => void
}) {
    const router = useRouter()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormInputs>({
        resolver: zodResolver(loginSchema),
    })

    const onSubmit = async (data: LoginFormInputs) => {
        console.log("hello")
    }

    return (
        <div className="h-auto flex items-center justify-center  rounded-xl  w-full ">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-4 w-full"
            >
                <div className="intro flex flex-col gap-2">
                    <div className="logo flex justify-center items-center rounded-xl border-2 border-gray-100 text-gray-300 p-4 h-[70px] w-[70px]">
                        Logo
                    </div>
                    <p className="text-3xl font-bold break-words max-w-sm">
                        Welcome Back
                    </p>
                </div>

                <div className="flex flex-col gap-6 w-full">
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
                        forgotPassword
                        placeholder="Passwor"
                        {...register("password")}
                    />
                    {errors.email && (
                        <p className="text-sm text-red-500 mt-1">
                            {errors.email.message}
                        </p>
                    )}
                </div>
                <Button size={"lg"} onClick={loginEnd} type="submit">
                    Continue
                </Button>

                <div className="line w-full bg-border h-[1px]" />

                <div className="text-center flex items-center justify-center gap-1 text-sm text-[var(--input-text)]">
                    <p>Don't have an account?</p>
                    <p onClick={() => changePageState("register")}>
                        <span className="text-primary"> Register</span>{" "}
                    </p>
                    instead
                </div>
            </form>
        </div>
    )
}

export default LoginForm
