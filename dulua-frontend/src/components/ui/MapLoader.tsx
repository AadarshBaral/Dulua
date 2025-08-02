"use client"

import dynamic from "next/dynamic"
import { useMemo } from "react"
import { pokharaPlaces } from "@lib/data"
import useCurrentLocation, { ILocation } from "@hooks/useCurrentLocation"
import { Place } from "@lib/types"

export const MapLoader = ({
    places,
    sidebar,
}: {
    places: Place[]
    sidebar: boolean
}) => {
    const { location } = useCurrentLocation()
    if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser")
    }

    const Map = useMemo(
        () =>
            dynamic(() => import("@components/ui/MapRenderer"), {
                loading: () => (
                    <div className="flex h-full justify-center items-center">
                        A map is loading...
                    </div>
                ),
                ssr: false,
            }),
        []
    )

    return (
        <div className="map-container z-0 m-4">
            {location ? (
                <Map
                    mapData={places}
                    location={location as ILocation}
                    className="w-[800px] h-[600px]"
                    sidebar={sidebar}
                />
            ) : (
                <div className="flex h-full justify-center items-center text-sm text-gray-500">
                    Getting your location...
                </div>
            )}
        </div>
    )
}

export default MapLoader
