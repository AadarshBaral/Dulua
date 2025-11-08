"use client"

import Image from "next/image"
import Link from "next/link"
import React from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { openModal } from "store/appSlice/modalStore"
import { useDispatch } from "react-redux"

const GuideWelcomeCard = () => {
    const router = useRouter()
    const dispatch = useDispatch()
    const handleGuideClick = () => {
        const token = localStorage.getItem("token") // ✅ check login token
        if (token) {
            router.push("/localguide")
        } else {
            dispatch(openModal())
        }
    }

    return (
        <div className="relative rounded-[3rem] overflow-hidden w-full mx-auto h-[300px] flex items-center justify-center">
            {/* Background Image */}
            <Image
                src="/pokhara.png"
                alt="Pokhara Background"
                fill
                className="object-cover"
                priority
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-green-950 to-green-950/10" />

            {/* Content */}
            <div className="relative z-10 text-center px-4 flex flex-col items-center gap-3">
                <h2 className="text-white text-2xl md:text-4xl font-bold mb-2">
                    Local Guides Welcome
                </h2>
                <p className="text-white text-sm md:text-lg mb-4 max-w-xl mx-auto">
                    Share your knowledge of Pokhara and help travelers discover
                    hidden gems while promoting sustainable tourism.
                </p>

                <button
                    onClick={handleGuideClick}
                    className="bg-lime-400 hover:bg-lime-500 text-black font-medium px-6 py-2 rounded-full shadow transition"
                >
                    Register as a guide
                </button>
            </div>
        </div>
    )
}

export default GuideWelcomeCard
