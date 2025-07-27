"use client"

import { IPlace } from "@api/core"
import Image from "next/image"
import React, { useState } from "react"
import { FaStar } from "react-icons/fa"
import { IoHeartSharp } from "react-icons/io5"
import { IoHeartOutline } from "react-icons/io5"
const PlaceCard = ({ place }: { place: IPlace }) => {
    const [isBookmarked, setIsBookmarked] = React.useState(false)
    return (
        <div className="place list-style-none selection-none">
            <div className="img-container relative selection-none">
                {isBookmarked ? (
                    <div
                        onClick={() => setIsBookmarked((prev) => !prev)}
                        className="clickable-target h-[48px] w-[48px]   absolute right-2 top-2 select-none"
                    >
                        <IoHeartSharp
                            className="absolute right-2 top-2 select-none"
                            size={30}
                            color="white"
                            stroke="black "
                            strokeWidth="12"
                        />
                    </div>
                ) : (
                    <div
                        onClick={() => setIsBookmarked((prev) => !prev)}
                        className=" h-[48px] w-[48px]  clickable-target p-4  absolute right-2 top-2 select-none"
                    >
                        <IoHeartOutline
                            className="absolute right-2 top-2 select-none"
                            size={30}
                            color="gray"
                        />
                    </div>
                )}

                <Image
                    src="/default.png"
                    alt="image"
                    className="rounded-3xl mb-2 select-none h-[250px] w-[250px] object-cover"
                    height={325}
                    width={325}
                />
            </div>
            <h3 className="text-lg font-semibold ">{place.name}</h3>

            <div className="place-details flex flex-row gap-2">
                <p>{place.city_name}</p>
                <p className="text-gray-300">|</p>
                <div className="flex flex-row justify-center items-center gap-2">
                    <FaStar />
                    <p>4.9</p>
                </div>
            </div>
        </div>
    )
}

export default PlaceCard
