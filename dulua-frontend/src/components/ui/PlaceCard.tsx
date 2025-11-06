"use client"

import { IPlace } from "@api/core"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { FaStar } from "react-icons/fa"
import BookmarkButton from "./BookmarkButton"
import { useGetReviewsQuery } from "store/fetchReviews"
import { FaLeaf } from "react-icons/fa6"

const PlaceCard = ({ place }: { place: IPlace }) => {
    const router = useRouter()
    const [imgSrc, setImgSrc] = useState(place.featured_image_main)
    const { data: reviews = [], isLoading } = useGetReviewsQuery(place.place_id)

    const rating =
        reviews.reduce((acc, r) => acc + r.rating, 0) / (reviews.length || 1)
    const cleanliness =
        reviews.reduce((acc, r) => acc + r.cleanliness, 0) /
        (reviews.length || 1)

    return (
        <div
            onClick={() => router.push(`/place/${place.place_id}`)}
            className="place list-style-none selection-none cursor-pointer group"
        >
            <div className="img-container relative selection-none">
                {/* ✅ Use global bookmark button */}
                <div
                    className="absolute right-3 top-3 z-10"
                    onClick={(e) => e.stopPropagation()} // prevent redirect
                >
                    <BookmarkButton place_id={place.place_id} />
                </div>

                <Image
                    src={imgSrc}
                    alt={place.name}
                    className="rounded-3xl mb-2 select-none h-[250px] w-[250px] object-cover group-hover:border-2 border-gray-300"
                    height={325}
                    width={325}
                    onError={() => setImgSrc("/default.png")}
                />
            </div>

            <h3 className="text-lg font-semibold">{place.name}</h3>

            <div className="place-details flex flex-row gap-2">
                <p>{place.city_name}</p>
                <p className="text-gray-300">|</p>
                <div className="flex flex-row justify-center items-center gap-2">
                    <div className="flex flex-row items-center gap-2">
                        <FaStar />
                        <p>{rating.toFixed(1)}</p>
                    </div>
                    <div className="flex flex-row items-center gap-2">
                        <FaLeaf />
                        <p>{cleanliness.toFixed(1)}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PlaceCard
