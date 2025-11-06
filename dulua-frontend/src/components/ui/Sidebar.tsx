"use client"

import { useState } from "react"
import { Map as LeafletMap, LatLng } from "leaflet"
import { Place } from "@lib/types"
import { ILocation } from "@hooks/useCurrentLocation"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useGetReviewsQuery } from "store/fetchReviews"
import { FaLeaf, FaStar } from "react-icons/fa6"

export interface Step {
    instruction?: string
    latLng?: LatLng
    distance?: number
}

interface Props {
    place: Place
    location: ILocation
    directions: Step[]
    map: LeafletMap | null
    onClose: () => void
    onGetDirections: () => void
}

export default function Sidebar({
    place,
    location,
    directions = [],
    map,
    onClose,
    onGetDirections,
}: Props) {
    const router = useRouter()

    const calculateDistance = () => {
        const toRad = (deg: number) => (deg * Math.PI) / 180
        const R = 6371
        const dLat = toRad(place.lat - location.latitude)
        const dLng = toRad(place.lng - location.longitude)
        const a =
            Math.sin(dLat / 2) ** 2 +
            Math.cos(toRad(location.latitude)) *
                Math.cos(toRad(place.lat)) *
                Math.sin(dLng / 2) ** 2
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
        return (R * c).toFixed(2)
    }
    const { data: reviews = [], isLoading } = useGetReviewsQuery(place.id)

    const rating =
        reviews.reduce((acc, r) => acc + r.rating, 0) / (reviews.length || 1)
    const cleanliness =
        reviews.reduce((acc, r) => acc + r.cleanliness, 0) /
        (reviews.length || 1)

    return (
        <div className="absolute top-4 left-4 h-[95vh] w-[500px] bg-white rounded-2xl shadow-2xl z-[1000] overflow-hidden border border-gray-200">
            <div className="relative flex flex-col overflow-y-auto h-full">
                {/* Header Image */}
                <div className="relative">
                    <Image
                        src={place.image || "/default.png"}
                        alt={place.name || "Place Image"}
                        width={800}
                        height={300}
                        className="w-full h-52 object-cover rounded-t-2xl"
                        unoptimized
                        onError={(e) => {
                            ;(e.target as HTMLImageElement).src = "/default.png"
                        }}
                    />
                    <button
                        onClick={onClose}
                        className="absolute top-3 right-3 text-black bg-white bg-opacity-70 hover:bg-opacity-90 px-2 py-1 rounded-full shadow-sm"
                    >
                        ✕
                    </button>
                </div>

                {/* Info Section */}
                <div className="bg-white px-5 pt-4 pb-3 space-y-2">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold">{place.name}</h2>
                        <div className="flex flex-row justify-center items-center gap-2">
                            <div className="flex flex-row items-center gap-2">
                                <FaStar className="text-yellow-400" />
                                <p>{rating.toFixed(1)}</p>
                            </div>
                            <div className="cont h-[15px] w-[1px] bg-gray-300"></div>
                            <div className="flex flex-row items-center gap-2">
                                <FaLeaf className="text-green-400" />
                                <p>{cleanliness.toFixed(1)}</p>
                            </div>
                        </div>
                    </div>
                    <p className="text-sm text-gray-600">
                        {place.category?.split(", ").map((cat) => (
                            <span
                                key={cat}
                                className="inline-block bg-gray-100 text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded"
                            >
                                {cat[0].toUpperCase() + cat.slice(1)}
                            </span>
                        ))}
                    </p>
                </div>

                {/* About Content */}
                <div className="p-5 overflow-y-auto flex-1 bg-white h-full">
                    <div className="space-y-3 relative h-full">
                        <ReactMarkdown
                            className="markdown prose prose-lg max-w-none"
                            children={place?.description as string}
                            remarkPlugins={[remarkGfm]}
                        />

                        {/* Action Buttons */}
                        <div className="cont w-full py-2 left-0 sticky bottom-1 flex flex-col gap-2 bg-white">
                            <button
                                onClick={() =>
                                    router.push(`/place/${place.id}`)
                                }
                                className="w-full bg-[#91db27] text-black font-semibold rounded-lg hover:bg-[#8ad324] transition py-2"
                            >
                                Read Full Detail
                            </button>
                            <button
                                onClick={onGetDirections}
                                className="w-full bg-white border-2 border-gray-200 text-black font-semibold rounded-lg hover:bg-[#d5d5d5] transition py-2"
                            >
                                Get Directions ({calculateDistance()} km)
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
