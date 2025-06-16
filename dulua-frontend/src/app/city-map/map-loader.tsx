"use client"
import dynamic from "next/dynamic"
import { useMemo } from "react"
import { pokharaPlaces } from "@lib/data"
import useCurrentLocation, { ILocation } from "@hooks/useCurrentLocation"
export const MapLoader = () => {
    const { location } = useCurrentLocation()
    console.log(location)
    const Map = useMemo(
        () =>
            dynamic(() => import("@components/map/Map"), {
                loading: () => <p>A map is loading</p>,
                ssr: false,
            }),
        []
    )

    return (
        <>
            <div className="bg-white-700 mx-auto my-5 w-[98%] h-screen">
                <Map mapData={pokharaPlaces} location={location as ILocation} />
            </div>
        </>
    )
}
export default Map
