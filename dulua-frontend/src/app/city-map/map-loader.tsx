"use client"

import dynamic from "next/dynamic"
import { useMemo } from "react"
import { pokharaPlaces } from "@lib/data"
import useCurrentLocation, { ILocation } from "@hooks/useCurrentLocation"

export const MapLoader = () => {
    const { location } = useCurrentLocation()
    if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser")
    }
    const Map = useMemo(
        () =>
            dynamic(() => import("@components/ui/MapRenderer"), {
                loading: () => (
                    <div className="flex h-[100vh] justify-center items-center">
                        A map is loading...
                    </div>
                ),
                ssr: false,
            }),
        []
    )

    return (
        <div className="map-container absolute inset-0 z-0">
            {location ? (
                <Map mapData={pokharaPlaces} location={location as ILocation} />
            ) : (
                <div className="flex h-[100vh] justify-center items-center text-sm text-gray-500">
                    Getting your location...
                </div>
            )}
        </div>
    )
}

export default MapLoader
