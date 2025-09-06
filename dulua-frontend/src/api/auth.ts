import { LoginFormInputs, RegisterFormInputs } from "@lib/validations"

export const registerUser = async ({ data }: { data: RegisterFormInputs }) => {
    try {
        const response = await fetch("http://localhost:8000/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: data.username,
                email: data.email,
                password: data.password,
            }),
        })

        const json = await response.json()

        return {
            status: response.status,
            data: json,
        }
    } catch (error) {
        console.error("Register request failed", error)
        return {
            status: 500,
            data: { detail: "Something went wrong" },
        }
    }
}

export const verifyOtp = async ({
    otp,
    email,
}: {
    otp: string
    email: string
}) => {
    const response = await fetch("http://localhost:8000/auth/verify_otp", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: email,
            otp: otp,
        }),
    })

    const json = await response.json()

    return {
        status: response.status,
        data: json,
    }
}

import { setCookie } from "nookies"

export const loginUserFunc = async ({ data }: { data: LoginFormInputs }) => {
    try {
        const body = new URLSearchParams()
        body.append("username", data.username)
        body.append("password", data.password)

        const response = await fetch("http://localhost:8000/auth/token", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: body.toString(),
        })

        const json = await response.json()
        return {
            status: response.status,
            data: json,
        }
    } catch (error) {
        console.error("Login request failed", error)
        return {
            status: 500,
            data: { detail: "Something went wrong" },
        }
    }
}
