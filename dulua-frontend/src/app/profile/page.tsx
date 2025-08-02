import { fetchPlaces, IPlace } from "@api/core"
import UserProfile from "@components/ui/UserProfile"

const Page = async () => {
    const places = await fetchPlaces()
    return <UserProfile places={places as IPlace[]} />
}

export default Page
