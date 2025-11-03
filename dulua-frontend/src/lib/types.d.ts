export interface Place {
    id: string
    name: string
    description: string
    image: string
    featured_image_secondary: string

    category: "place" | "food"
    lat: number
    lng: number
}
