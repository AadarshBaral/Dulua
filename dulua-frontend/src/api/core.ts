import FormData from "form-data"
import fs from "fs"

type ReviewPayload = {
    comment: string
    rating: number
    cleanliness: number
    timestamp: string
    place_id: string
    images: File[] // or Blob[] if on frontend
}

export interface IPlace {
    place_id: string
    city_id: string
    city_name: string
    name: string
    latitude: string
    longitude: string
    description: string
    featured: boolean
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
export async function sendReview(data: ReviewPayload, token: string) {
    const formData = new FormData()
    formData.append("comment", data.comment)
    formData.append("rating", data.rating.toString())
    formData.append("cleanliness", data.cleanliness.toString())
    formData.append("timestamp", data.timestamp)
    formData.append("place_id", data.place_id)
    data.images.forEach((file) => {
        formData.append("images", file as any, file.name)
    })
    const url = `${process.env.API_URL || "http://localhost:8000"}/place/add_review`

    const response = await fetch(url, {
        method: "POST",
        headers: {
            Authorization: `bearer ${token}`,
        },
        body: formData as any,
    })

    const result = await response.json()

    if (!response.ok) {
        throw new Error(result?.message || "Failed to submit review")
    }

    return result
}
