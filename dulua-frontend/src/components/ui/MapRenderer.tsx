"use client"

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import { LatLngTuple, Map as LeafletMap } from "leaflet"
import { useEffect, useState } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import "leaflet-routing-machine"
import "leaflet-defaulticon-compatibility"
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css"

import { Place } from "@lib/types"
import { ILocation } from "@hooks/useCurrentLocation"
import Sidebar from "./Sidebar"
import { cn } from "@lib/utils"

const MyLocationIcon = new L.Icon({
    iconUrl: "/usermarker.png",
    iconSize: [65, 65],
})

const PlaceIcon = new L.Icon({
    iconUrl: "/placemarker.png",
    iconSize: [60, 60],
})

export type Step = {
    instruction: string
    latLng: L.LatLng
    distance: number
}

function MapRenderer({
    mapData,
    location,
    className,
    sidebar = true,
}: {
    mapData: Place[]
    location: ILocation
    className?: string
    sidebar?: boolean
}) {
    const [selectedPlace, setSelectedPlace] = useState<Place | null>(null)
    const [route, setRoute] = useState<LatLngTuple[]>([])
    const [directions, setDirections] = useState<Step[]>([])
    const [mapInstance, setMapInstance] = useState<LeafletMap | null>(null)

    const handleGetDirections = (dest: Place) => {
        if (!location) return
        const origin: LatLngTuple = [location.latitude, location.longitude]
        const destination: LatLngTuple = [dest.lat, dest.lng]
        setRoute([origin, destination])
        setSelectedPlace(dest)
    }

    return (
        <div className={cn("relative h-32 w-32", className)}>
            <MapContainer
                center={[28.2096, 83.9856]}
                zoom={13}
                scrollWheelZoom
                //@ts-ignore
                whenCreated={setMapInstance}
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
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

                {route.length === 2 && (
                    <RouteLine
                        positions={route}
                        setDirections={setDirections}
                    />
                )}
            </MapContainer>

            {selectedPlace && sidebar && location && (
                <Sidebar
                    place={selectedPlace}
                    location={location}
                    directions={directions}
                    map={mapInstance}
                    onClose={() => {
                        setSelectedPlace(null)
                        setRoute([])
                        setDirections([])
                    }}
                    onGetDirections={() => handleGetDirections(selectedPlace)}
                />
            )}
        </div>
    )
}

const RouteLine = ({
    positions,
    setDirections,
}: {
    positions: LatLngTuple[]
    setDirections: (steps: Step[]) => void
}) => {
    const map = useMap()

    useEffect(() => {
        if (!positions || positions.length < 2) return

        //@ts-expect-error install leaflet-routing-machine
        const routingControl = L.Routing.control({
            waypoints: positions.map((pos) => L.latLng(pos)),
            createMarker: () => null,
            addWaypoints: false,
            show: false,
            lineOptions: {
                styles: [{ color: "#1976d2", weight: 6 }],
            },
            //@ts-ignore install leaflet-routing-machine
            router: L.Routing.osrmv1({
                serviceUrl: "https://router.project-osrm.org/route/v1",
            }),
        }).addTo(map)

        routingControl.on("routesfound", (e: any) => {
            const route = e.routes[0]
            const steps: Step[] = []

            route.legs?.forEach((leg: any) => {
                leg.steps?.forEach((step: any) => {
                    if (step.instruction && step.latLng) {
                        steps.push({
                            instruction: step.instruction,
                            latLng: step.latLng,
                            distance: step.distance,
                        })

                        // Optional: Step marker
                        L.circleMarker(step.latLng, {
                            radius: 32,
                            color: "red",
                            fillColor: "red",
                            fillOpacity: 1,
                        }).addTo(map)
                    }
                })
            })

            setDirections(steps)
        })

        return () => {
            map.removeControl(routingControl)
        }
    }, [positions, map, setDirections])

    return null
}

export default MapRenderer
