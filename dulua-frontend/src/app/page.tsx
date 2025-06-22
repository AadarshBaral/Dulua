import Image from "next/image"
import React from "react"

const NearbyCarousel = () => {
    return (
        <div className="relative p-4 mx-20 ">
            {/* Header */}

            <div className="flex gap-4 mt-8 h-[60vh]">
                {/* Left Card */}
                <div className="relative w-1/2  overflow-hidden ">
                    <Image
                        width={500}
                        height={500}
                        src={"/batcave.png"}
                        alt="Bat Cave"
                        className="w-full h-full object-fill rounded-4xl "
                    />
                    <div className="overlay bg-gradient-to-t from-black/40 to-transparent absolute top-0 left-0 w-full h-full rounded-4xl"></div>

                    <div className="absolute z-0 bottom-2 w-[95%] ml-auto mr-auto left-0 right-0 h-fit rounded-4xl text-white bg-green-900/ bg-opacity-50  p-4   bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-60">
                        <h3 className="font-semibold">Bat Cave</h3>
                        <p className="text-sm">Dare to explore?</p>
                    </div>
                </div>
                <div className="relative w-1/2  overflow-hidden ">
                    <Image
                        width={500}
                        height={500}
                        src={"/batcave.png"}
                        alt="Bat Cave"
                        className="w-full h-full object-fill rounded-4xl "
                    />
                    <div className="overlay bg-gradient-to-t from-black/40 to-transparent absolute top-0 left-0 w-full h-full rounded-4xl"></div>

                    <div className="absolute z-0 bottom-2 w-[95%] ml-auto mr-auto left-0 right-0 h-fit rounded-4xl text-white bg-green-900/ bg-opacity-50  p-4   bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-60">
                        <h3 className="font-semibold">Another Bat Cave</h3>
                        <p className="text-sm">Dare to explore?</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NearbyCarousel
