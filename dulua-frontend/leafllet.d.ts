// src/types/leaflet.d.ts
import * as L from "leaflet"

declare module "leaflet" {
    namespace L {
        class HeatLayer extends Layer {
            constructor(latlngs: LatLng[], options?: HeatLayerOptions)
        }

        interface HeatLayerOptions {
            radius?: number
            blur?: number
            maxZoom?: number
            gradient?: { [key: number]: string }
        }

        function heatLayer(
            latlngs: LatLng[],
            options?: HeatLayerOptions
        ): HeatLayer
    }
}
