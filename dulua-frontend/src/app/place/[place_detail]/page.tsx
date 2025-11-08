import Review from "@components/ui/review"
import ReactDom from "react-dom"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
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
import MapRenderer from "@components/ui/MapRenderer"
import useCurrentLocation, { ILocation } from "@hooks/useCurrentLocation"
import MapLoader from "@components/ui/MapLoader"
import { FaPhone } from "react-icons/fa6"

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
    const placeData = await getPlace(place_detail)
    console.log(placeData)
    const guides = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/local_guide/getAllLocalGuides/${placeData?.place_id}`,
        {
            method: "GET",
            cache: "no-store",
        }
    ).then(async (res) => {
        const responseBody = await res.text() // Get the raw response body
        console.log("Response body:", responseBody)
        try {
            return JSON.parse(responseBody) // Try parsing manually to check validity
        } catch (e) {
            console.error("Invalid JSON response", e)
            throw new Error("Failed to parse JSON response")
        }
    })

    console.log("Guides:", guides)
    console.log(guides)
    const markdown = `# Just a link: https://reactjs.com.`

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

            <Tabs place_id={placeData?.place_id || ""}>
                <Tab key="details" title="Details">
                    <div className="mb-8">
                        <ReactMarkdown
                            className="markdown prose prose-lg max-w-none"
                            children={placeData?.description as string}
                            remarkPlugins={[remarkGfm]}
                        />
                        <div className="line w-full h-[2px] bg-gray-200 my-16"></div>
                        <div>
                            <p className="mb-4 text-2xl font-semibold text-primary">
                                Local Guides around {placeData?.name}
                            </p>
                            <div className="cont flex flex-row gap-4">
                                {guides && guides.length > 0 ? (
                                    guides.map((guide, idx) => (
                                        <div
                                            key={idx}
                                            className="guide w-fit border-2 border-gray-100 rounded-3xl p-6 flex flex-col"
                                        >
                                            <div className="cont h-48 w-48 rounded-full bg-gray-200">
                                                <Image
                                                    src={`${process.env.NEXT_PUBLIC_API_URL}${guide.profile_image || "/default.png"}`}
                                                    alt={guide.name}
                                                    height={192}
                                                    width={192}
                                                    className="rounded-full object-cover h-48 w-48"
                                                />
                                            </div>
                                            <div className="info mt-4 flex flex-col justify-center items-center gap-2">
                                                <h3 className="text-lg font-semibold">
                                                    {guide.name}
                                                </h3>
                                                <div className="cont flex items-center gap-1 py-2 px-6 border-2 border-gray-200 rounded-full mt-1">
                                                    <FaPhone className="text-accent" />
                                                    <p>{guide.contact}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center text-gray-500">
                                        No active guides found for this place
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </Tab>

                <Tab key="map" title="Map">
                    <div className="mb-8 ">
                        <MapLoader
                            sidebar={false}
                            places={[
                                {
                                    id: placeData?.place_id as string,
                                    name: placeData?.name as string,
                                    category: "place",
                                    lat: parseFloat(
                                        placeData?.latitude as string
                                    ),
                                    lng: parseFloat(
                                        placeData?.longitude as string
                                    ),
                                    description:
                                        placeData?.description as string,
                                    image:
                                        placeData?.featured_image_main ||
                                        "/default.png",
                                    featured_image_secondary:
                                        placeData?.featured_image_secondary ||
                                        "/default.png",
                                },
                            ]}
                        />
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
