import React from "react"
import AddGuide from "./add_guide"
import { fetchPlaces } from "@api/core"
import Image from "next/image"

export const page = async () => {
    const places = await fetchPlaces()

    return (
        <div>
            <div className="cont flex flex-row md:flex-row gap-4 mb-8 my-20 ml-20">
                <div className="bg-gray-100 h-[80vh] w-[30vw] rounded-3xl  flex flex-col gap-4">
                    <Image
                        src="/local_guide.png"
                        alt="image"
                        className="object-cover rounded-3xl w-full h-full"
                        width={600}
                        height={600}
                    />
                </div>
                <AddGuide places={places || []} />
            </div>
        </div>
    )
}

export default page
