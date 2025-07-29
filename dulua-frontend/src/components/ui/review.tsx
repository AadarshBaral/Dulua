"use client"

import Image from "next/image"
import React, { useRef, useState } from "react"
import { FaStar, FaShareAlt, FaPen, FaHeart, FaTrash } from "react-icons/fa"
import { Button } from "./button"
import { Pen } from "lucide-react"
import { openModal } from "store/appSlice/modalStore"

const reviews = [
    {
        name: "Towhidur Rahman",
        rating: 5,
        text: `My first and only mala ordered on Etsy, and I'm beyond delighted! I requested a custom mala based on two stones I was called to invite together in this kind of creation. The fun and genuine joy I invite together in this kind of creation.\nThe fun and genuine joy.`,
        contribution: "$200",
        totalReview: 14,
        date: "24-10-2022",
        avatar: "/avatar1.png",
    },
    {
        name: "Towhidur Rahman",
        rating: 3,
        text: `My first and only mala ordered on Etsy, and I'm beyond delighted! I requested a custom mala based on two stones I was called to invite together in this kind of creation. The fun and genuine joy I invite together in this kind of creation.\nThe fun and genuine joy.`,
        contribution: "$200",
        totalReview: 14,
        date: "24-10-2022",
        avatar: "/avatar1.png",
    },
    {
        name: "Towhidur Rahman",
        rating: 1,
        text: `My first and only mala ordered on Etsy, and I'm beyond delighted! I requested a custom mala based on two stones I was called to invite together in this kind of creation. The fun and genuine joy I invite together in this kind of creation.\nThe fun and genuine joy.`,
        contribution: "$200",
        totalReview: 14,
        date: "24-10-2022",
        avatar: "/avatar1.png",
    },
]

export default function ReviewsSection() {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [stars, setStars] = useState(0)
    const [comment, setComment] = useState("")
    const fileInputRef = useRef(null)
    const [images, setImages] = useState<File[]>([])

    const handleCameraCapture = (event) => {
        const files = Array.from(event.target.files)
        setImages((prev) => [...prev, ...files])
    }

    const removeImage = (indexToRemove) => {
        setImages((prev) => prev.filter((_, index) => index !== indexToRemove))
    }

    const ratingDistribution = [0, 200, 500, 1000, 2000] // For 1 to 5 stars

    return (
        <section className="max-w-6xl mx-auto px-4 py-10">
            {/* Summary Stats */}
            <div className="flex flex-wrap justify-between  items-center  border-b-2 py-10 border-gray-100 mb-10 ">
                <div>
                    <h3 className="text-foreground text-md font-bold">
                        Total Reviews
                    </h3>
                    <p className="text-3xl font-bold">10.0k</p>
                </div>
                <div className="line h-32  bg-gray-200 w-[1px]"></div>
                <div>
                    <h3 className="text-foreground text-md font-bold">
                        Average Rating
                    </h3>
                    <p className="text-2xl font-bold flex items-center">
                        4.0 <FaStar className="ml-1 text-yellow-400" />
                    </p>
                </div>
                <div className="line h-32  bg-gray-200 w-[1px]"></div>
                <div className="space-y-1 w-full mt-4 sm:mt-0 sm:w-auto">
                    {[5, 4, 3, 2, 1].map((star, idx) => (
                        <div
                            key={star}
                            className="flex items-center gap-2 text-sm"
                        >
                            <span className="w-4">{star}</span>
                            <FaStar className="text-yellow-400" />
                            <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className="h-2 bg-green-400"
                                    style={{
                                        width: `${(ratingDistribution[5 - star] / 2000) * 100}%`,
                                    }}
                                />
                            </div>
                            <span className="text-xs text-gray-500">
                                {ratingDistribution[5 - star]}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
            <div className="cont flex justify-end">
                <Button onClick={() => setIsModalOpen((prev) => !prev)}>
                    <Pen /> Write a Review
                </Button>
            </div>
            {/* Individual Reviews */}
            <div className="">
                {reviews.map((review, index) => (
                    <div
                        key={index}
                        className="flex  gap-32 border-b-2 border-gray-100  py-12 x"
                    >
                        <div className="flex w-1/3 gap-4  ">
                            <Image
                                width={32}
                                height={32}
                                src="/default.png"
                                alt={review.name}
                                className=" h-1/2 w-16 object-cover rounded-md"
                            />
                            <div>
                                <p className="font-semibold text-gray-900 w-full">
                                    {review.name}
                                </p>
                                <div className="text-sm text-gray-500">
                                    <p>
                                        Total Reviews:{" "}
                                        <span className="font-bold">200</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="cont w-2/3">
                            <div className="flex items-center gap-2 text-sm">
                                {/* Stars */}
                                {[...Array(5)].map((_, i) => (
                                    <FaStar
                                        key={i}
                                        className={
                                            i < review.rating
                                                ? "text-yellow-400"
                                                : "text-gray-300"
                                        }
                                    />
                                ))}

                                {/* Rating Count */}
                                <span className="text-gray-600 text-xs ml-2">
                                    {review.rating} out of 5
                                </span>

                                {/* Date */}
                                <span className="text-gray-400 text-xs ml-4">
                                    {review.date}
                                </span>
                            </div>

                            <p className="text-sm text-gray-700 mt-2 whitespace-pre-line">
                                {review.text}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 space-y-5">
                        <h2 className="text-2xl font-bold text-gray-800 text-center">
                            Rate us!
                        </h2>
                        <p className="text-sm text-gray-500 text-center">
                            Your input is super important in helping us
                            understand your needs better, so we can customize
                            our services to suit you perfectly.
                        </p>

                        <div>
                            <p className="font-medium text-gray-700 mb-2 text-center">
                                How would you rate our app?
                            </p>
                            <div className="flex justify-center space-x-3">
                                {[...Array(5)].map((_, i) => (
                                    <FaStar
                                        key={i}
                                        size={28}
                                        onClick={() => setStars(i + 1)}
                                        onMouseEnter={() => setStars(i + 1)}
                                        onMouseLeave={() => {}}
                                        className={`cursor-pointer transition ${
                                            i < stars
                                                ? "text-yellow-400"
                                                : "text-gray-300"
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>

                        <textarea
                            placeholder="Add a comment..."
                            className="w-full p-3 border rounded-md text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            rows={3}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />

                        <div className="space-y-2">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleCameraCapture}
                                className="text-sm text-gray-600"
                            />
                            <div className="flex space-x-3 overflow-x-auto">
                                {images.map((file, index) => (
                                    <div
                                        key={index}
                                        className="relative w-16 h-16"
                                    >
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt={`preview-${index}`}
                                            className="w-full h-full object-cover rounded-md"
                                        />
                                        <button
                                            className="absolute -top-2 -right-2 bg-red-500 text-white text-xs p-1 rounded-full"
                                            onClick={() => removeImage(index)}
                                        >
                                            <FaTrash size={10} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-sm font-medium"
                            >
                                Cancel
                            </button>
                            <button className="px-4 py-2 rounded-md bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium">
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    )
}
