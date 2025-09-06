import type { Metadata } from "next"
import "../globals.css"
import AuthLayout from "@components/auth/authLayout"
import StoreProvider from "./storeprovider"
import { Manrope } from "next/font/google"
import DuluaNav from "@components/ui/DuluaNav"
import Footer from "@components/ui/Footer"
import { FloatingDock } from "@components/ui/FloatingDock"
import { links } from "@lib/DockItems"

const inter = Manrope({
    subsets: ["latin"],
    weight: ["400", "700"], // optional
    display: "swap", // improves performance
})

export const metadata: Metadata = {
    title: "",
    description: "",
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <StoreProvider>
                <body
                    className={inter.className}
                    style={{ position: "relative" }}
                >
                    <div className="cont fixed bottom-10 z-95 left-[50%] -translate-x-[50%] flex justify-center items-center">
                        <FloatingDock items={links} />
                    </div>
                    <AuthLayout />
                    <div className="mw-container  mx-[200px]">
                        <DuluaNav heroDetail={true} heroTitle={"Pokhara"} />
                        {children}
                    </div>

                    <Footer />
                </body>
            </StoreProvider>
        </html>
    )
}
