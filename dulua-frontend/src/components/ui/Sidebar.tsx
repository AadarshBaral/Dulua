"use client"

import { Place } from "@lib/types"
import { ILocation } from "@hooks/useCurrentLocation"

interface Props {
    place: Place
    location: ILocation
    onClose: () => void
    onGetDirections: () => void
}

export default function Sidebar({
    place,
    location,
    onClose,
    onGetDirections,
}: Props) {
    const calculateDistance = () => {
        const toRad = (deg: number) => (deg * Math.PI) / 180
        const R = 6371 // Radius of the Earth in km
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

    return (
        <div className="absolute top-0 left-0 h-full w-[360px] bg-white shadow-lg z-[1000] overflow-auto rounded-l-2xl">
            <div className="relative">
                <img
                    src="/default.png"
                    alt={place.name}
                    className="w-full h-52 object-cover rounded-t-2xl"
                />
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-white bg-black bg-opacity-40 px-2 py-1 rounded"
                >
                    ✕
                </button>
            </div>
            <div className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">
                        {place.name || "Tranquil Haven Retreat"}
                    </h2>
                    <div className="text-blue-600 font-semibold flex items-center gap-1">
                        <span>4.9</span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            className="w-4 h-4"
                        >
                            <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                    </div>
                </div>
                <p className="text-sm text-gray-600">
                    Hosted by <span className="font-medium">Adam fort</span>
                </p>
                <p className="text-md text-black font-semibold">
                    124TND Per Night
                </p>
                <p className="text-sm text-gray-500">
                    Escape to this serene single-family home nestled amidst
                    nature's embrace. With spacious interiors and panoramic
                    views, Tranquil Haven Retreat offers a perfect blend of
                    comfort and tranquility. Ideal for those seeking a peaceful
                    lifestyle without compromising on modern amenities.
                </p>
                <div className="flex gap-2 mt-2">
                    <img
                        src="/default.png"
                        alt="interior"
                        className="w-24 h-20 object-cover rounded"
                    />
                    <img
                        src="/default.png"
                        alt="interior"
                        className="w-24 h-20 object-cover rounded"
                    />
                    <img
                        src="/default.png"
                        alt="interior"
                        className="w-24 h-20 object-cover rounded"
                    />
                </div>

                <button
                    onClick={onGetDirections}
                    className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg text-center text-sm font-medium hover:bg-blue-700 transition"
                >
                    Get Directions ({calculateDistance()} km)
                </button>

                <button className="w-full mt-2 bg-gray-100 text-gray-700 py-2 rounded-lg text-center text-sm font-medium hover:bg-gray-200 transition">
                    Check availability
                </button>
            </div>
        </div>
    )
}
