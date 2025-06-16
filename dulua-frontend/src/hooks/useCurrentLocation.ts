import React, { useEffect, useState } from "react"

export interface ILocation {
    latitude: number
    longitude: number
}

const useCurrentLocation = () => {
    const [mensen, setMensen] = useState([])
    const [location, setLocation] = useState<ILocation | null>(null)

    const fetchApiData = async ({ latitude, longitude }) => {
        const res = await fetch(
            `https://openmensa.org/api/v2/canteens?near[lat]=${latitude}&near[lng]=${longitude}&near[dist]=50000`
        )
        const data = await res.json()
        setMensen(data)
    }

    useEffect(() => {
        if ("geolocation" in navigator) {
            // Retrieve latitude & longitude coordinates from `navigator.geolocation` Web API
            navigator.geolocation.getCurrentPosition(({ coords }) => {
                const { latitude, longitude } = coords
                setLocation({ latitude, longitude })
            })
        }
    }, [])

    useEffect(() => {
        // Fetch data from API if `location` object is set
        if (location) {
            fetchApiData(location)
        }
    }, [location])

    return { location }
}

export default useCurrentLocation
