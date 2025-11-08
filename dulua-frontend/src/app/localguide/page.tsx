import React from "react"
import AddGuide from "./add_guide"
import { fetchPlaces } from "@api/core"
import Image from "next/image"
import { cookies } from "next/headers"
export const dynamic = "force-dynamic" // ensures fresh fetch per request

export const page = async () => {
    const places = await fetchPlaces()
    const cookieStore = await cookies()
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/local_guide/checkIfLocalGuide`,
        {
            headers: {
                Authorization: `bearer ${cookieStore.get("token")?.value}`,
            },
            cache: "no-store",
        }
    )

    if (!res.ok) {
        console.error("Failed to fetch local guide status")
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-red-500 font-semibold">
                    Could not verify local guide status. Please try again later.
                </p>
            </div>
        )
    }

    const { can_fill_form, message } = await res.json()

    // 🔹 If already registered or pending
    if (!can_fill_form) {
        return (
            <div className="flex flex-col items-center justify-center h-[80vh] text-center px-6">
                <h1 className="text-2xl font-semibold text-gray-800 mb-2">
                    Already Registered
                </h1>
                <p className="text-gray-600">{message}</p>
            </div>
        )
    }

    // 🔹 Otherwise, render the guide registration page
    return (
        <div className="cont flex flex-row md:flex-row gap-4 mb-8 my-20 ml-20">
            <div className="bg-gray-100 h-[80vh] w-[30vw] rounded-3xl flex flex-col gap-4">
                <Image
                    src="/local_guide.png"
                    alt="image"
                    className="object-cover rounded-3xl w-full h-full"
                    width={600}
                    height={600}
                />
            </div>
            <AddGuide places={places || []} />
        </div>
    )
}

export default page
