import { Button } from "@components/ui/button"
import { Mail } from "lucide-react"
import React from "react"
import { FcGoogle } from "react-icons/fc"
import { Step } from "../authLayout"

const Intro = ({
    loginStart,
    changePageState,
}: {
    loginStart: () => void
    changePageState: (state: Step) => void
}) => {
    return (
        <div className="w-full flex gap-12 flex-col ">
            <div className="intro flex flex-col gap-2">
                <div className="logo flex justify-center items-center rounded-xl border-2 border-gray-100 text-gray-300 p-4 h-[70px] w-[70px]">
                    Logo
                </div>
                <p className="text-3xl font-bold break-words max-w-sm">
                    Sign in to Unlock the best of Pokhara.
                </p>
            </div>

            <div className="btn-container flex flex-col gap-4 w-full">
                <Button
                    variant={"outline"}
                    className="flex justify-center items-center w-full h-12"
                    size={"lg"}
                    onClick={loginStart}
                >
                    <FcGoogle />
                    <p>Sign In With Google</p>
                </Button>
                <Button
                    variant={"outline"}
                    className="flex justify-center items-center w-full h-12"
                    size={"lg"}
                    onClick={loginStart}
                >
                    <Mail />
                    <p>Sign In With Email</p>
                </Button>
                {/* <div className="text-center flex items-center justify-center gap-1 text-sm text-[var(--input-text)]">
                    <p onClick={() => changePageState("register")}>
                        <span className="text-"> Register</span>{" "}
                    </p>
                </div> */}
            </div>
        </div>
    )
}

export default Intro
