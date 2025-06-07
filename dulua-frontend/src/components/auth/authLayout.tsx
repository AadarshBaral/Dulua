"use client"
import { Button } from "@components/ui/button"
import { ChevronLeftIcon, Cross, Crosshair, Mail, X } from "lucide-react"
import Image from "next/image"
import React, { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { closeModal } from "store/appSlice/authLayout"
import { RootState } from "store/store"
import { FcGoogle } from "react-icons/fc"

import RegisterForm from "./authComponents/register-form"
import VerifyCodeForm from "./authComponents/verify-code-form"
import Intro from "./authComponents/intro"
import LoginForm from "./authComponents/login-form"

export type Step = "intro" | "login" | "register" | "verifyCode"

const AuthLayout = () => {
    const modalOpen = useSelector(
        (state: RootState) => state.authLayout.modalOpen
    )
    const [loginComplete, setLoginCoplete] = useState(false)
    const [registerComplete, setRegisterComplete] = useState(false)
    const [verifyCodeComplete, setVerifyCodeComplete] = useState(false)
    const dispatch = useDispatch()

    const handleLoginStart = () => {
        setCurrentStep("login" as Step)
    }
    const handleLoginEnd = () => {
        console.log("Login End")
    }
    const handleRegisterEnd = () => {
        console.log("Register End")
    }
    const handleVerifyCodeEnd = () => {
        console.log("Verify Code End")
    }

    const [currentStep, setCurrentStep] = useState("intro" as Step)
    return (
        <>
            {modalOpen && (
                <div
                    className="wrapper absolute top-0 flex justify-center items-center  w-full h-full bg-black/20"
                    onClick={() => dispatch(closeModal())}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="fixed sm:min-w-md min-w-full  h-full sm:min-h-[550px] sm:h-auto  sm:border-2 border-gray-200 bg-white sm:rounded-2xl rounded-none flex flex-col justify-center sm:justify-start gap-4 p-4 md:shadow-sm"
                    >
                        <div className="actions   flex flex-row w-full justify-between items-center">
                            <p>
                                {currentStep !== "intro" && (
                                    <ChevronLeftIcon
                                        onClick={() => setCurrentStep("intro")}
                                        className="  text-foreground/80 cursor-pointer"
                                    />
                                )}
                            </p>
                            <X
                                onClick={() => dispatch(closeModal())}
                                className="  text-foreground/80 self-end cursor-pointer"
                            />
                        </div>

                        <div className="px-4">
                            {currentStep === "intro" && (
                                <Intro loginStart={handleLoginStart} />
                            )}
                            {currentStep === "login" && (
                                <LoginForm
                                    loginEnd={handleLoginEnd}
                                    changePageState={setCurrentStep}
                                />
                            )}
                            {currentStep === "register" && (
                                <RegisterForm
                                    changePageState={setCurrentStep}
                                    registerEnd={handleRegisterEnd}
                                />
                            )}
                            {currentStep === "verifyCode" && (
                                <VerifyCodeForm
                                    verifyCodeEnd={handleVerifyCodeEnd}
                                />
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default AuthLayout
