"use client"

import dynamic from "next/dynamic"
import { useEffect, useMemo, useState } from "react"
import useCurrentLocation, { ILocation } from "@hooks/useCurrentLocation"

const API_BASE = process.env.NEXT_PUBLIC_API_URL // e.g. http://localhost:8000

export const MapLoader = () => {
    const { location } = useCurrentLocation()
    const [places, setPlaces] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    console.log("places", places)
    // ✅ Fetch all places from backend
    useEffect(() => {
        const fetchPlaces = async () => {
            try {
                const res = await fetch(`${API_BASE}/place/all_places`)
                if (!res.ok) throw new Error("Failed to fetch places")
                const data = await res.json()

                // ✅ Transform backend data into map format
                const mappedPlaces = data.map((p: any) => ({
                    id: p.place_id,
                    name: p.name,
                    lat: p.latitude,
                    lng: p.longitude,
                    description: p.description,
                    featured: p.featured,
                    average_place_rating: p.average_place_rating,
                    average_cleanliness: p.average_cleanliness,
                    image: p.featured_image_main,
                    category: p.category?.map((c: any) => c.name).join(", "),
                }))

                setPlaces(mappedPlaces)
            } catch (err: any) {
                console.error("Error fetching places:", err)
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchPlaces()
    }, [])

    const Map = useMemo(
        () =>
            dynamic(() => import("@components/ui/MapRenderer"), {
                loading: () => (
                    <div className="flex h-[100vh] justify-center items-center">
                        Loading map...
                    </div>
                ),
                ssr: false,
            }),
        []
    )

    if (loading) {
        return (
            <div className="flex h-[100vh] justify-center items-center text-sm text-gray-500">
                Loading places...
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex h-[100vh] justify-center items-center text-sm text-red-500">
                Failed to load places: {error}
            </div>
        )
    }

    return (
        <div className="map-container absolute inset-0 z-0">
            {location ? (
                <Map
                    mapData={places} // ✅ Dynamic DB data
                    location={location as ILocation}
                    className="w-[100vw] h-[100vh]"
                />
            ) : (
                <div className="flex h-[100vh] justify-center items-center text-sm text-gray-500">
                    Getting your location...
                </div>
            )}
        </div>
    )
}

export default MapLoader
