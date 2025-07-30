"use client"

import { IPlace } from "@api/core"
import Image from "next/image"
import Link from "next/link"
import React from "react"

const FeaturedSection = ({ places }: { places: IPlace[] }) => {
    const featured = places.filter((p) => p.featured)

    const firstCard = featured[0] ?? {
        name: "Bat Cave",
        featured_image_main: "/batcave.png",
        description: "Dare to explore?",
    }

    const secondCard = featured[1] ?? {
        name: "Pokhara",
        featured_image_main: "/pokhara.png",
        description: "Nature meets city",
    }

    const renderCard = (place: Partial<IPlace>) => {
        const cardContent = (
            <div className="relative w-full h-full overflow-hidden">
                <Image
                    width={500}
                    height={500}
                    src={place.featured_image_main!}
                    alt={place.name!}
                    className="w-full h-full object-cover rounded-[3rem]"
                />
                <div className="overlay bg-gradient-to-t from-black/40 to-transparent absolute top-0 left-0 w-full h-full rounded-[3rem]"></div>

                <div className="absolute z-0 bottom-3 w-[95%] ml-auto mr-auto left-0 right-0 h-fit rounded-4xl text-white bg-green-800/20 bg-opacity-50 p-4 bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-60">
                    <h3 className="font-semibold text-2xl mb-2">
                        {place.name}
                    </h3>
                    <p className="text-sm">{place.description}</p>
                </div>
            </div>
        )

        return (
            <div className="relative w-1/2 overflow-hidden">
                {place.place_id ? (
                    <Link href={`/place/${place.place_id}`}>{cardContent}</Link>
                ) : (
                    cardContent
                )}
            </div>
        )
    }

    return (
        <div className="flex gap-4 mt-8 h-[60vh] mb-16">
            {renderCard(firstCard)}
            {renderCard(secondCard)}
        </div>
    )
}

export default FeaturedSection
