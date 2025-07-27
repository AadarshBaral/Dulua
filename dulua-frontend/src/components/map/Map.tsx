"use client"
import dynamic from "next/dynamic"
import { useMemo } from "react"
import { pokharaPlaces } from "@lib/data"
import useCurrentLocation, { ILocation } from "@hooks/useCurrentLocation"
import MapRenderer from "@components/ui/MapRenderer"

export const MapLoader = () => {
    const { location } = useCurrentLocation()
    console.log(location)
    // const Map = useMemo(
    //     () =>
    //         dynamic(() => import("@components/map/Map"), {
    //             loading: () => <p>A map is loading</p>,
    //             ssr: false,
    //         }),
    //     []
    // )

    return (
        <>
            <div className="cont absolute inset-0">
                <MapRenderer
                    mapData={pokharaPlaces}
                    location={location as ILocation}
                />
            </div>
        </>
    )
}
export default Map
