"use client"

import { Button } from "@components/ui/button"
import { Input } from "@components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import React from "react"
import { loginSchema, LoginFormInputs } from "@lib/validations"
import { Step } from "../authLayout"
import { useAppDispatch, useAppSelector } from "@lib/hooks"
import { RootState } from "store/store"
import { fetchUserProfile, loginUser } from "store/appSlice/authSlice"
import { closeModal } from "store/appSlice/modalStore"

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

    const dispatch = useAppDispatch()
    const { user, loading, error } = useAppSelector(
        (state: RootState) => state.auth
    )

    const onSubmit = async (data: LoginFormInputs) => {
        const result = await dispatch(loginUser(data))

        if (loginUser.fulfilled.match(result)) {
            await dispatch(
                fetchUserProfile({
                    token: result.payload.access_token,
                    tokenType: result.payload.token_type,
                })
            )
        }
        dispatch(closeModal())
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
                        Welcome Back
                    </p>
                </div>

                <div className="flex flex-col gap-6 w-full">
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
                        type="password"
                        label="Password"
                        forgotPassword
                        placeholder="Password"
                        {...register("password")}
                    />
                    {errors.password && (
                        <p className="text-sm text-red-500 mt-1">
                            {errors.password.message}
                        </p>
                    )}
                </div>

                <Button size="lg" type="submit" disabled={loading}>
                    {loading ? (
                        <div className="flex items-center gap-2">
                            <span className="animate-spin rounded-full h-4 w-4 border-2 border-t-transparent border-white"></span>
                            Signing in...
                        </div>
                    ) : (
                        "Continue"
                    )}
                </Button>

                <div className="line w-full bg-border h-[1px]" />

                <div className="text-center flex items-center justify-center gap-1 text-sm text-[var(--input-text)]">
                    <p>Don't have an account?</p>
                    <p
                        onClick={() => changePageState("register")}
                        className="text-accent cursor-pointer"
                    >
                        Register
                    </p>
                    instead
                </div>
            </form>
        </div>
    )
}

export default LoginForm
