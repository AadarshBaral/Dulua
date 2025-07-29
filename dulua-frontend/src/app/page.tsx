import { fetchPlaces } from "@api/core"
import GuideWelcomCard from "@components/ui/GuideWelcome"
import PlaceCard from "@components/ui/PlaceCard"

import Image from "next/image"
import React from "react"
import { FaStar } from "react-icons/fa"
import { IoHeartSharp } from "react-icons/io5"
import { IoHeartOutline } from "react-icons/io5"

const Page = async () => {
    const places = await fetchPlaces()
    console.log(places)
    return (
        <div className="relative p-4 mx-20 ">
            {/* Header */}

            <div className="flex gap-4 mt-8 h-[60vh] mb-16">
                {/* Left Card */}
                <div className="relative w-1/2  overflow-hidden ">
                    <Image
                        width={500}
                        height={500}
                        src={"/batcave.png"}
                        alt="Bat Cave"
                        className="w-full h-full object-cover rounded-[3rem]"
                    />
                    <div className="overlay bg-gradient-to-t from-black/40 to-transparent absolute top-0 left-0 w-full h-full rounded-[3rem]"></div>

                    <div className="absolute z-0 bottom-3 w-[95%] ml-auto mr-auto left-0 right-0 h-fit rounded-4xl text-white bg-green-800/20 bg-opacity-50  p-4   bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-60">
                        <h3 className="font-semibold text-2xl mb-2">
                            Bat Cave
                        </h3>
                        <p className="text-sm">Dare to explore?</p>
                    </div>
                </div>
                <div className="relative w-1/2  overflow-hidden ">
                    <Image
                        width={500}
                        height={500}
                        src={"/pokhara.png"}
                        alt="Bat Cave"
                        className="w-full h-full object-cover rounded-[3rem] "
                    />
                    <div className="overlay bg-gradient-to-t from-black/40 to-transparent absolute top-0 left-0 w-full h-full rounded-[3rem]"></div>

                    <div className="absolute z-0 bottom-3 w-[95%] ml-auto mr-auto left-0 right-0 h-fit rounded-4xl text-white bg-green-800/20 bg-opacity-50  p-4   bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-60">
                        <h3 className="font-semibold text-2xl mb-2">
                            Bat Cave
                        </h3>
                        <p className="text-sm">Dare to explore?</p>
                    </div>
                </div>
            </div>
            <div className="places">
                <p className="mb-4 text-xl font-semibold">
                    Must Visit in Pokhara
                </p>
                <div className="cont flex flex-wrap gap-6">
                    {/* <IoHeartOutline /> */}
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
