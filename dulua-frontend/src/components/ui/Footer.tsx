// components/Footer.tsx
"use client"
import { cn } from "@lib/utils"
import Image from "next/image"
import { useParams, usePathname } from "next/navigation"
import {
    FaTiktok,
    FaInstagram,
    FaFacebook,
    FaLinkedin,
    FaXTwitter,
} from "react-icons/fa6"

export default function Footer() {
    const pathname = usePathname()
    console.log(pathname)

    return (
        <footer
            className={cn(
                "relative min-h-[80vh] bg-cover bg-center flex justify-center items-center text-white py-12 overflow-hidden   w-full",
                pathname === "/city-map" && "hidden"
            )}
        >
            {/* Background Image */}
            <Image
                src="/pokhara.png"
                alt="footer"
                fill
                className="object-cover"
                priority
            />

            {/* Overlay */}
            <div className="bg-primary/50 absolute inset-0 " />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center  space-y-12">
                <h2 className="text-6xl font-semibold ">DULUA</h2>
                <div className="cont flex flex-col justify-center items-center gap-4">
                    <p className="text-lg text-gray-300">Social Links</p>
                    <div className="flex space-x-4">
                        <a
                            href="#"
                            className="bg-white/20 p-3 rounded-lg hover:bg-white/30 transition"
                        >
                            <FaTiktok size={32} />
                        </a>
                        <a
                            href="#"
                            className="bg-white/20 p-3 rounded-lg hover:bg-white/30 transition"
                        >
                            <FaInstagram size={32} />
                        </a>
                        <a
                            href="#"
                            className="bg-white/20 p-3 rounded-lg hover:bg-white/30 transition"
                        >
                            <FaFacebook size={32} />
                        </a>
                        <a
                            href="#"
                            className="bg-white/20 p-3 rounded-lg hover:bg-white/30 transition"
                        >
                            <FaLinkedin size={32} />
                        </a>
                        <a
                            href="#"
                            className="bg-white/20 p-3 rounded-lg hover:bg-white/30 transition"
                        >
                            <FaXTwitter size={32} />
                        </a>
                    </div>
                    <p className="text-sm text-gray-200 mt-12">
                        &copy; 2025 Dulua. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    )
}
