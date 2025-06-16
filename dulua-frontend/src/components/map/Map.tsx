// src/components/map/index.tsx

"use client"

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import { LatLngExpression, LatLngTuple } from "leaflet"

import "leaflet/dist/leaflet.css"
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css"
import "leaflet-defaulticon-compatibility"
import { Place } from "@lib/types"
import { Link } from "lucide-react"
import { useRouter } from "next/navigation"
import { ILocation } from "@hooks/useCurrentLocation"
const Map = ({
    mapData,
    location,
}: {
    mapData: Place[]
    location: ILocation
}) => {
    const navigation = useRouter()
    const handleLinkClick = (placeName: string) => {
        navigation.push(`/place/${placeName}`)
    }
    console.log("my location", location)

    // useEffect(() => {
    //     const inter = setInterval(() => {
    //         console.log("my location", location)
    //     }, 1000)

    //     return () => {
    //         clearInterval(inter)
    //     }
    // }, [])

    return (
        <MapContainer
            center={[28.2096, 83.9856]}
            zoom={13}
            minZoom={5}
            scrollWheelZoom={true}
            style={{ height: "100%", width: "100%" }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {location && (
                <Marker position={[location.latitude, location.longitude]}>
                    <Popup>I am here</Popup>
                </Marker>
            )}
            {mapData.map((data, index) => (
                <Marker
                    key={index}
                    position={[data.lat, data.lng]}
                    draggable={false}
                >
                    <Popup>
                        <span>{data.name}</span>
                        <img src="/logo/haha 1.png" alt="marker" />
                        <p
                            className="cursor-pointer"
                            onClick={() => handleLinkClick(data.name)}
                        >
                            Go to {data.name}
                        </p>
                    </Popup>
                </Marker>
            ))}
            {/* <Marker position={[28.2096, 83.9856]}>
                <Popup>Hey ! I study here</Popup>
            </Marker> */}
        </MapContainer>
    )
}

export default Map
