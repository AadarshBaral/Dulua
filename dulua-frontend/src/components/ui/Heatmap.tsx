"use client"

import { useMap } from "react-leaflet"
import { useEffect } from "react"
import * as L from "leaflet"
import "leaflet.heat" // Import L (Leaflet) with heatmap plugin

type TrashPoints = [number, number, number] // lat, lng, intensity

interface IAddressPoints {
    addressPoints: TrashPoints[]
}

const Heatmap = ({
    heatmapEnabled,
    addressPoints,
}: {
    heatmapEnabled: boolean
    addressPoints: TrashPoints[]
}) => {
    const map = useMap() // Get the map instance

    useEffect(() => {
        if (!map) return // Ensure the map instance is ready

        // If heatmap is enabled, add the heatmap layer, else remove it
        if (heatmapEnabled) {
            const points = addressPoints.map((p) => [p[0], p[1], p[2]]) // lat, lng, intensity

            const heatmapLayer = L.heatLayer(points, {
                radius: 25, // Adjust for spread of heat spots
                blur: 15, // Adjust for blur effect
                maxZoom: 17, // Optional: set max zoom level for heatmap visibility
                gradient: {
                    0.0: "green", // Low intensity (green)
                    0.1: "lightgreen", // Slightly higher intensity (light green)
                    0.3: "yellow", // Medium-low intensity (yellow)
                    0.5: "orange", // Medium intensity (orange)
                    0.75: "orangered", // High intensity (orange-red)
                    1.0: "red", // Maximum intensity (red)
                },
                minOpacity: 0.2, // Ensure that low intensity (0.0) is visible
            }).addTo(map)

            // Cleanup when heatmap is disabled
            return () => {
                map.removeLayer(heatmapLayer)
            }
        }
    }, [heatmapEnabled, map, addressPoints]) // Run the effect when `heatmapEnabled` or `addressPoints` changes

    return null // No need to render anything in the JSX
}

export default Heatmap
