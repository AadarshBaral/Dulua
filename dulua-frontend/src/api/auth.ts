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

export const loginUseFunc = async ({ data }: { data: LoginFormInputs }) => {
    try {
        const response = await fetch("http://localhost:8000/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: data.username,
                password: data.password,
            }),
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
