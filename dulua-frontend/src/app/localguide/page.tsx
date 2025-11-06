import React from "react"
import AddGuide from "./add_guide"
import { fetchPlaces } from "@api/core"

export const page = async () => {
    const places = await fetchPlaces()

    return (
        <div>
            <AddGuide places={places || []} />
        </div>
    )
}

export default page
