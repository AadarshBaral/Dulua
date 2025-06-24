import * as z from "zod"

export const ChangePasswordSchema = z
    .object({
        password: z.string().min(1, { message: "Password is required" }),
        confirmPassword: z.string().min(1, { message: "Password is required" }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    })

export const forgotpasswordSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
})

export const loginSchema = z.object({
    username: z.string().min(1, "Username is required"),
    password: z.string().min(1, { message: "Password is required" }),
})

export const registerSchema = z.object({
    username: z.string().min(1, "Username is required"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
})

export const otpSchema = z.object({
    code: z
        .string()
        .min(4, "Code must be 4 digits")
        .max(4, "Code must be 4 digits")
        .regex(/^\d{4}$/, "Code must contain only digits"),
})

export type OtpFormInputs = z.infer<typeof otpSchema>
export type RegisterFormInputs = z.infer<typeof registerSchema>
export type LoginFormInputs = z.infer<typeof loginSchema>
export type ForgotPasswordInputs = z.infer<typeof forgotpasswordSchema>
export type ChangePasswordInputs = z.infer<typeof ChangePasswordSchema>
