"use client"

import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    useMap,
    Polyline,
} from "react-leaflet"
import { LatLngTuple } from "leaflet"
import { useEffect, useRef, useState } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import "leaflet-routing-machine"
import "leaflet-defaulticon-compatibility"
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css"

import { Place } from "@lib/types"
import { ILocation } from "@hooks/useCurrentLocation"
import dynamic from "next/dynamic"
import Sidebar from "./Sidebar"

const MyLocationIcon = new L.Icon({
    iconUrl: "/usermarker.png",
    iconSize: [65, 65],
})

const PlaceIcon = new L.Icon({
    iconUrl: "/placemarker.png",
    iconSize: [60, 60],
})

export default function MapRenderer({
    mapData,
    location,
}: {
    mapData: Place[]
    location: ILocation
}) {
    const [selectedPlace, setSelectedPlace] = useState<Place | null>(null)
    const [route, setRoute] = useState<LatLngTuple[]>([])

    const handleGetDirections = (dest: Place) => {
        if (!location) return
        const origin: LatLngTuple = [location.latitude, location.longitude]
        const destination: LatLngTuple = [dest.lat, dest.lng]
        setRoute([origin, destination])
        setSelectedPlace(dest)
    }

    return (
        <div className="relative w-[100vw] h-[100vh] !mx-0 border-4  ">
            <MapContainer
                center={[28.2096, 83.9856]}
                zoom={13}
                minZoom={5}
                scrollWheelZoom
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                {location && (
                    <Marker
                        position={[location.latitude, location.longitude]}
                        icon={MyLocationIcon}
                    >
                        <Popup>You are here</Popup>
                    </Marker>
                )}

                {mapData.map((data, index) => (
                    <Marker
                        key={index}
                        position={[data.lat, data.lng]}
                        icon={PlaceIcon}
                        eventHandlers={{
                            click: () => setSelectedPlace(data),
                        }}
                    />
                ))}

                {route.length === 2 && <RouteLine positions={route} />}
            </MapContainer>

            {selectedPlace && location && (
                <Sidebar
                    place={selectedPlace}
                    location={location}
                    onClose={() => {
                        setSelectedPlace(null)
                        setRoute([])
                    }}
                    onGetDirections={() => handleGetDirections(selectedPlace)}
                />
            )}
        </div>
    )
}

const RouteLine = ({ positions }: { positions: LatLngTuple[] }) => {
    const map = useMap()

    useEffect(() => {
        if (!positions || positions.length < 2) return

        //@ts-expect-error ts-migrate(2554) FIXME: Expected 1-2 arguments, but got 3.
        const routingControl = L.Routing.control({
            waypoints: positions.map((pos) => L.latLng(pos)),
            createMarker: () => null,
            addWaypoints: false,
            lineOptions: {
                styles: [{ color: "#1976d2", weight: 6 }],
            },
        }).addTo(map)

        return () => {
            map.removeControl(routingControl)
        }
    }, [positions, map])

    return null
}
