"use client"

import dynamic from "next/dynamic"
import { useMemo } from "react"
import { pokharaPlaces } from "@lib/data"
import useCurrentLocation, { ILocation } from "@hooks/useCurrentLocation"

export const MapLoader = () => {
    const { location } = useCurrentLocation()

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
        <div className="cont absolute inset-0">
            <Map mapData={pokharaPlaces} location={location as ILocation} />
        </div>
    )
}

export default MapLoader
