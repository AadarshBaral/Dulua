export interface Place {
    id: string
    name: string
    description: string
    image: string
    featured_image_secondary: string
    average_place_rating: number
    average_cleanliness: number
    category: "place" | "food"
    lat: number
    lng: number
}
