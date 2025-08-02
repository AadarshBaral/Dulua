"use client"

import Image from "next/image"
import React, { useEffect, useRef, useState } from "react"
import { FaStar, FaShareAlt, FaPen, FaHeart, FaTrash } from "react-icons/fa"
import { Button } from "./button"
import { Pen } from "lucide-react"
import { openModal } from "store/appSlice/modalStore"
import { FaCross, FaLeaf } from "react-icons/fa6"
import { useAppSelector } from "@lib/hooks"
import { RootState } from "store/store"
import { sendReview } from "@api/core"
import { IoMdClose } from "react-icons/io"
import { useAddReviewMutation, useGetReviewsQuery } from "store/fetchReviews"
import { cn } from "@lib/utils"

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

export default function ReviewsSection({ place_id }: { place_id: string }) {
    const { data: reviews = [], isLoading } = useGetReviewsQuery(place_id)
    const [addReview] = useAddReviewMutation()
    const token = useAppSelector((state: RootState) => state.auth.token)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [stars, setStars] = useState(1)
    const [leaf, setLeaf] = useState(1)
    const [comment, setComment] = useState("")
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [images, setImages] = useState<File[]>([])
    console.log("its palce id", place_id)
    const handleCameraCapture = (event) => {
        const files: File[] = Array.from(event.target.files)
        setImages((prev) => [...prev, ...files])
    }
    console.log("here is data", reviews)
    const removeImage = (indexToRemove: number) => {
        setImages((prev) => prev.filter((_, index) => index !== indexToRemove))
    }
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setIsModalOpen(false)
            }
        }
        window.addEventListener("keydown", handleEsc)
        resetReviewForm()
        return () => window.removeEventListener("keydown", handleEsc)
    }, [])
    const resetReviewForm = () => {
        setStars(1)
        setLeaf(1)
        setComment("")
        setImages([])
        setIsModalOpen(false)
        if (fileInputRef.current) {
            fileInputRef.current.value = "" // Clear file input manually
        }
    }

    const handleSubmit = async () => {
        const formData = new FormData()
        formData.append("place_id", place_id)
        formData.append("rating", stars.toString())
        formData.append("cleanliness", leaf.toString())
        formData.append("comment", comment)
        formData.append("timestamp", new Date().toISOString())
        images.forEach((img) => formData.append("images", img))

        try {
            await addReview(formData).unwrap()

            setStars(1)
            setLeaf(1)
            setComment("")
            setImages([])
            setIsModalOpen(false)
        } catch (err) {
            console.error("Error adding review", err)
        }
    }

    const rating =
        reviews.reduce(
            (accumulator, review) => accumulator + review.rating,
            0
        ) / reviews.length
    const cleanliness =
        reviews.reduce(
            (accumulator, review) => accumulator + review.cleanliness,
            0
        ) / reviews.length

    const ratingDistribution = reviews.reduce(
        (acc, review) => {
            const r = review.cleanliness
            acc[r] = (acc[r] || 0) + 1
            return acc
        },
        {} as Record<number, number>
    )
    console.log("hey", reviews)

    return (
        <section className="max-w-6xl mx-auto px-4 py-10">
            {/* Summary Stats */}
            <div className="flex flex-wrap justify-between  items-center  border-b-2 py-10 border-gray-100 mb-10 ">
                <div>
                    <h3 className="text-foreground text-md font-bold">
                        Total Reviews
                    </h3>
                    <p className="text-3xl font-bold">{reviews.length}</p>
                </div>
                <div className="line h-32  bg-gray-200 w-[1px]"></div>
                <div>
                    <h3 className="text-foreground text-md font-bold">
                        Average Rating & Cleanliness
                    </h3>
                    <div className="cont flex gap-4">
                        <p className="text-2xl font-bold flex items-center">
                            {rating ? rating.toFixed(1) : 0}
                            <FaStar className="ml-1 text-yellow-400" />
                        </p>
                        <p className="text-2xl font-bold flex items-center">
                            {cleanliness ? cleanliness.toFixed(1) : 0}
                            <FaLeaf className="ml-1 text-green-400" />
                        </p>
                    </div>
                </div>
                <div className="line h-32  bg-gray-200 w-[1px]"></div>
                <div className="space-y-1 w-full mt-4 sm:mt-0 sm:w-auto">
                    {[5, 4, 3, 2, 1].map((star) => {
                        const count = ratingDistribution[star] || 0
                        const percentage = (count / reviews.length) * 100

                        return (
                            <div
                                key={star}
                                className="flex items-center gap-2 text-sm"
                            >
                                <span className="w-4">{star}</span>
                                <FaLeaf className="text-green-400" />
                                <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-2 bg-green-400"
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                                <span className="text-xs text-gray-500">
                                    {count}
                                </span>
                            </div>
                        )
                    })}
                </div>
            </div>
            <div className="cont flex justify-end">
                <Button
                    onClick={() => {
                        setIsModalOpen((prev) => !prev)
                    }}
                >
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
                        <div className="flex w-1/3 gap-4   ">
                            <Image
                                width={32}
                                height={32}
                                src="/default.png"
                                alt={review.name}
                                className="  w-16 h-16 object-cover rounded-xl"
                            />
                            <div>
                                <p className="font-semibold text-gray-900 w-full">
                                    {review.username}
                                </p>
                                <div className="cont flex gap-1">
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
                                </div>
                                <div className="cont flex gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar
                                            key={i}
                                            className={
                                                i < review.cleanliness
                                                    ? "text-green-400"
                                                    : "text-gray-300"
                                            }
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="cont w-2/3">
                            <div className="flex items-center gap-2 text-sm">
                                {/* Stars */}
                                {/* {[...Array(5)].map((_, i) => (
                                    <FaStar
                                        key={i}
                                        className={
                                            i < review.rating
                                                ? "text-yellow-400"
                                                : "text-gray-300"
                                        }
                                    />
                                ))}

                              */}

                                {/* Date */}
                                <span className="text-gray-400 text-xs 4">
                                    {
                                        new Date(review.timestamp)
                                            .toISOString()
                                            .split("T")[0]
                                    }
                                </span>
                            </div>
                            <div className="cont flex flex-col gap-4 w-fit">
                                <p className="text-sm text-gray-700 mt-2 whitespace-pre-line">
                                    {review.comment}
                                </p>
                                <div
                                    className={cn(
                                        "cont grid grid-cols-3 items-start justify-items-start  gap-2"
                                    )}
                                >
                                    {review.images.length > 0 &&
                                        review.images.map((image, index) => {
                                            console.log("crrr", image)
                                            return (
                                                <Image
                                                    key={index}
                                                    src={image}
                                                    width={100}
                                                    height={100}
                                                    className="w-32 h-32 rounded-xl object-cover border-2 border-gray-100 p-2 "
                                                    alt="image"
                                                />
                                            )
                                        })}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div
                    className="fixed inset-0 z-95 flex items-center justify-center bg-black/60 px-4"
                    onClick={() => {
                        resetReviewForm()
                        setIsModalOpen(false)
                    }} // background click closes modal
                >
                    <div
                        className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-xl space-y-4 text-left relative"
                        onClick={(e) => e.stopPropagation()} // prevents background click from closing
                    >
                        <button
                            onClick={() => {
                                resetReviewForm()
                                setIsModalOpen(false)
                            }}
                            className="absolute top-4 right-4 text-gray-400 hover:text-black text-xl"
                            aria-label="Close"
                        >
                            <IoMdClose />
                        </button>
                        {/* Heading */}
                        <h2 className="text-xl font-bold text-gray-800">
                            Review
                        </h2>

                        {/* Place Rating */}
                        <div>
                            <label className="text-sm font-semibold text-gray-700 mb-1 block">
                                Rate your experience
                                <span className="text-red-500">*</span>
                            </label>
                            <div className="flex space-x-1">
                                {[...Array(5)].map((_, i) => (
                                    <FaStar
                                        key={i}
                                        size={28}
                                        onClick={() => setStars(i + 1)}
                                        className={`cursor-pointer ${
                                            i < stars
                                                ? "text-orange-500"
                                                : "text-gray-300"
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Cleanliness Rating */}
                        <div>
                            <label className="text-sm font-semibold text-gray-700 mb-1 block">
                                How clean is this place?
                            </label>
                            <div className="flex space-x-1">
                                {[...Array(5)].map((_, i) => (
                                    <FaLeaf
                                        key={i}
                                        size={28}
                                        onClick={() => setLeaf(i + 1)}
                                        className={`cursor-pointer ${
                                            i < leaf
                                                ? "text-green-500"
                                                : "text-gray-300"
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Comment */}
                        <div>
                            <label className="text-sm font-semibold text-gray-700 mb-1 block">
                                Description
                            </label>
                            <textarea
                                placeholder="Write your review here..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="w-full rounded-2xl px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm resize-none"
                                rows={3}
                            />
                        </div>

                        {/* Drag & Drop Section */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 block">
                                Add images
                            </label>
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="cursor-pointer border-2 border-dashed border-gray-300 rounded-2xl p-4 text-center text-gray-500 text-sm hover:bg-gray-50 transition"
                            >
                                Drag & drop or click to upload
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleCameraCapture}
                                className="hidden"
                            />
                            <div className="flex gap-3 flex-wrap mt-2">
                                {images.map((file, index) => (
                                    <div
                                        key={index}
                                        className="relative w-20 h-20"
                                    >
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt={`preview-${index}`}
                                            className="w-full h-full object-cover rounded-lg"
                                        />
                                        <button
                                            onClick={() => removeImage(index)}
                                            className="absolute -top-2 -right-2 bg-black bg-opacity-70 rounded-full p-1"
                                        >
                                            <FaTrash className="text-white text-xs" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-2">
                            <Button
                                onClick={handleSubmit}
                                className="w-full bg-black text-white py-3 rounded-full text-sm font-medium hover:bg-gray-900 transition"
                            >
                                Send Review
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    )
}
