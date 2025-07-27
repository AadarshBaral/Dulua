export interface IPlace {
    id: string
    city_id: string
    city_name: string
    name: string
    latitude: string
    longitude: string
    description: string
    category: string[]
}
type Props = {
    places: IPlace[]
}

export const fetchPlaces = async (): Promise<IPlace[] | null> => {
    try {
        const res = await fetch("http://localhost:8000/place/all_places")

        if (!res.ok) {
            console.error("Failed to fetch places:", res.statusText)
            return null
        }

        const data = await res.json()
        return data as IPlace[]
    } catch (error) {
        console.error("Error fetching places:", error)
        return null
    }
}
