import { fetchPlaces, IPlace } from "@api/core"
import GuideWelcomCard from "@components/ui/GuideWelcome"
import PlaceCard from "@components/ui/PlaceCard"
import FeaturedSection from "@components/ui/FeaturedSection" // ✅ import

import React from "react"

const Page = async () => {
    const places = await fetchPlaces()

    return (
        <div className="relative p-4 mx-20">
            {/* ✅ Featured Section */}
            <FeaturedSection places={places || ({} as IPlace[])} />

            <div className="places">
                <p className="mb-4 text-xl font-semibold">
                    Must Visit in Pokhara
                </p>
                <div className="cont flex flex-wrap gap-6">
                    {places?.map((place, index) => (
                        <PlaceCard key={index} place={place} />
                    ))}
                </div>

                <div className="cont my-20">
                    <GuideWelcomCard />
                </div>
            </div>
        </div>
    )
}

export default Page
