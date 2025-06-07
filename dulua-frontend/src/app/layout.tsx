import type { Metadata } from "next"
import "../globals.css"
import AuthLayout from "@components/auth/authLayout"
import StoreProvider from "./storeprovider"
import { Manrope } from "next/font/google"

const inter = Manrope({
    subsets: ["latin"],
    weight: ["400", "700"], // optional
    display: "swap", // improves performance
})

export const metadata: Metadata = {
    title: "Dulua",
    description: "Pokhara | Travel Guide",
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <StoreProvider>
                <body className={inter.className}>
                    <AuthLayout />
                    {children}
                </body>
            </StoreProvider>
        </html>
    )
}
