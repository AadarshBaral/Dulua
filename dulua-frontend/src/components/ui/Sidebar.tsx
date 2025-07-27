"use client"

import { useState } from "react"
import { Map as LeafletMap, LatLng } from "leaflet"
import { Place } from "@lib/types"
import { ILocation } from "@hooks/useCurrentLocation"

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
    const [activeTab, setActiveTab] = useState<"about" | "reviews">("about")

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

    return (
        <div className="absolute top-4 left-4 h-[95vh] w-[360px] bg-white rounded-2xl shadow-2xl z-[1000] overflow-hidden flex flex-col border border-gray-200">
            {/* Header Image */}
            <div className="relative">
                <img
                    src="/default.png"
                    alt={place.name}
                    className="w-full h-52 object-cover rounded-t-2xl"
                />
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-black bg-white bg-opacity-70 hover:bg-opacity-90 px-2 py-1 rounded-full shadow-sm"
                >
                    ✕
                </button>
            </div>

            {/* Info + Tabs */}
            <div className="bg-white px-5 pt-4 pb-3 space-y-2">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">{place.name}</h2>
                    <div className="text-green-700 font-bold flex items-center gap-1">
                        <span>4.9</span> ⭐
                    </div>
                </div>
                <p className="text-sm text-gray-600">
                    Escape to this serene home nestled amidst nature...
                </p>
            </div>

            {/* Tab Buttons */}
            {/* Tab Buttons (Styled like image) */}
            <div className="border-b border-gray-300 flex justify-start pl-4 gap-4">
                {["about", "reviews"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as "about" | "reviews")}
                        className={`relative py-3 px-4 text-sm font-medium transition-colors duration-200 ${
                            activeTab === tab
                                ? "text-teal-700 border-b-2 border-teal-700"
                                : "text-gray-500 hover:text-teal-700"
                        }`}
                    >
                        {tab === "about" ? "About" : "Reviews"}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="p-5 overflow-y-auto flex-1 bg-white h-full">
                {activeTab === "about" ? (
                    <div className="space-y-3 relative h-full">
                        Lorem ipsum dolor sit amet consectetur, adipisicing
                        elit. Dolores ad quam dicta optio impedit, dolore enim
                        repudiandae, officiis a ratione quis, delectus ducimus
                        expedita. A exercitationem aut dolor mollitia quibusdam?
                        <button
                            onClick={onGetDirections}
                            className="w-full py-2 left-0  absolute bottom-2 bg-[#A4F03B] text-black font-semibold rounded-lg hover:bg-[#91db27] transition"
                        >
                            Get Directions ({calculateDistance()} km)
                        </button>
                    </div>
                ) : (
                    <div className="space-y-3 text-sm text-gray-600">
                        <p>
                            <strong>Prem Kumari:</strong> Loved the view and
                            location. Peaceful and clean. 🌿
                        </p>
                        <p>
                            <strong>Ramesh:</strong> Great host and comfortable
                            place. Will visit again.
                        </p>
                        <p>
                            <strong>Sita:</strong> Best nature getaway in
                            Pokhara!
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
