// src/page.tsx

import dynamic from "next/dynamic"
import { useMemo } from "react"
import { Place } from "@lib/types"
import { pokharaPlaces } from "@lib/data"
import { MapLoader } from "./map-loader"
export default async function Page() {
    return <MapLoader />
}
