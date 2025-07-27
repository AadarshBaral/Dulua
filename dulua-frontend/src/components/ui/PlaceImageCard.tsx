"use client"

import Image from "next/image"
import { useState } from "react"

export const PlaceImageCard = ({
    src,
    title,
    subtitle,
}: {
    src: string
    title: string
    subtitle: string
}) => {
    const [imgSrc, setImgSrc] = useState(src)

    return (
        <div className="relative w-1/2 overflow-hidden">
            <Image
                width={500}
                height={500}
                src={imgSrc}
                alt={title}
                onError={() => setImgSrc("/default.png")}
                className="w-full h-full object-cover rounded-[3rem]"
            />
            <div className="overlay bg-gradient-to-t from-black/40 to-transparent absolute top-0 left-0 w-full h-full rounded-[3rem]" />
        </div>
    )
}
