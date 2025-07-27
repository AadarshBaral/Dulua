export interface IPlace {
    place_id: string
    city_id: string
    city_name: string
    name: string
    latitude: string
    longitude: string
    description: string
    featured_image_main: string
    featured_image_secondary: string
    category: string[]
}
type Props = {
    places: IPlace[]
}

const baseURL = (url: string = "") => {
    return process.env.API_URL + url
}

export const fetchPlaces = async (): Promise<IPlace[] | null> => {
    try {
        const res = await fetch(baseURL("/place/all_places"))

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

export const getPlace = async (place_id: string): Promise<IPlace | null> => {
    try {
        const res = await fetch(baseURL(`/place/get_place/${place_id}`))
        if (!res.ok) {
            console.error("Failed to fetch places:", res.statusText)
            return null
        }

        const data = await res.json()
        return data
    } catch (error) {
        console.error("Error fetching places:", error)
        return null
    }
}
