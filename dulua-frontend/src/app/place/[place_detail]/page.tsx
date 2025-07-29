import Review from "@components/ui/review"

import { FaStar } from "react-icons/fa"
import Image from "next/image"
import Tabs from "@components/ui/OutlineTabs"
import Tab from "@components/ui/Tab"
import { getPlace } from "@api/core"
import { Place } from "@lib/types"
import { PlaceImageCard } from "@components/ui/PlaceImageCard"

interface Props {
    params: Promise<{ place_detail: string }>
}

import { Metadata } from "next"

export async function generateMetadata({
    params,
}: {
    params: { place_detail: string }
}): Promise<Metadata> {
    const { place_detail } = params
    const placeData = await getPlace(place_detail)

    return {
        title: `${placeData?.name} | Explore Pokhara`,
        description: placeData?.description?.slice(0, 150),
        openGraph: {
            title: `${placeData?.name} | Explore Pokhara`,
            description: placeData?.description?.slice(0, 150),
            images: [
                {
                    url: placeData?.featured_image_secondary || "/default.png",
                    width: 1200,
                    height: 630,
                    alt: placeData?.name,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: `${placeData?.name} | Explore Pokhara`,
            description: placeData?.description?.slice(0, 150),
            images: [placeData?.featured_image_secondary || "/default.png"],
        },
    }
}

export default async function PlaceDetail({ params }: Props) {
    const { place_detail } = await params
    console.log(place_detail)
    const placeData = await getPlace(place_detail)

    const images = [
        {
            src: `${placeData?.featured_image_main || "/default.png"}`,
            title: placeData?.name,
            subtitle: "Dare to explore?",
        },
        {
            src: `${placeData?.featured_image_secondary || "/default.png"}`,
            title: placeData?.name,
            subtitle: "Discover the beauty!",
        },
    ]

    return (
        <div className="px-8 py-8 max-w-6xl mx-20">
            {/* Breadcrumb / Page Title */}
            <div className="flex items-center gap-2 mb-6">
                <span className="text-gray-500">Pokhara</span>
                <span className="mx-2 text-gray-400">/</span>
                <span className="font-bold text-3xl">{placeData?.name}</span>
            </div>

            {/* Images */}
            <div className="flex gap-4 mb-16 h-[60vh]">
                {images.map((img, idx) => (
                    <PlaceImageCard
                        key={idx}
                        src={img.src}
                        title={img.title || ""}
                        subtitle={img.subtitle}
                    />
                ))}
            </div>

            <Tabs>
                <Tab key="about" title="About">
                    <div className="mb-8">
                        <h3 className="font-medium mb-2">About </h3>
                        <p className="text-gray-700 leading-relaxed">{}</p>
                        <p className="text-gray-600 text-sm">
                            {placeData?.description}
                        </p>
                    </div>
                </Tab>

                <Tab key="details" title="Details">
                    <div className="mb-8">
                        <h3 className="font-medium mb-2">Details</h3>
                        <ul className="list-disc pl-5 text-gray-700 space-y-1">
                            <li>Open Hours: 9:00 AM – 6:00 PM daily</li>
                            <li>
                                Entry Fee: NPR 100 (Local), NPR 500 (Tourists)
                            </li>
                            <li>
                                Guided Tours: Available in English and Nepali
                            </li>
                            <li>Best Time to Visit: October – April</li>
                            <li>Contact: +977-9800000000</li>
                        </ul>
                    </div>
                </Tab>

                <Tab key="map" title="Map">
                    <div className="mb-8">
                        <h3 className="font-medium mb-2">Map</h3>
                    </div>
                </Tab>

                <Tab key="reviews" title="Reviews">
                    <div className="mb-8">
                        <Review place_id={place_detail} />
                    </div>
                </Tab>
            </Tabs>
        </div>
    )
}
