"use client"

import Image from "next/image"
import React, { useEffect, useRef, useState } from "react"
import { FaStar, FaLeaf, FaTrash, FaExclamationTriangle } from "react-icons/fa"
import { Button } from "./button"
import { Pen } from "lucide-react"
import { IoMdClose } from "react-icons/io"
import { useAppSelector } from "@lib/hooks"
import { RootState } from "store/store"
import { useAddReviewMutation, useGetReviewsQuery } from "store/fetchReviews"
import { cn } from "@lib/utils"
import { openModal } from "store/appSlice/modalStore"
import { useDispatch } from "react-redux"

export default function ReviewsSection({
    place_id,
    openFromTabs,
    onCloseModal,
}: {
    place_id: string
    openFromTabs?: boolean
    onCloseModal?: () => void
}) {
    const { data: reviews = [], isLoading } = useGetReviewsQuery(place_id)
    const [addReview, { isLoading: isSubmitting }] = useAddReviewMutation()
    const token = useAppSelector((state: RootState) => state.auth.token)

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [stars, setStars] = useState(1)
    const [leaf, setLeaf] = useState(1)
    const [comment, setComment] = useState("")
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [images, setImages] = useState<File[]>([])
    console.log("Reviews data:", reviews)
    // ✅ Unified gallery modal

    useEffect(() => {
        if (openFromTabs) {
            setIsModalOpen(true)
            onCloseModal?.()
        }
    }, [openFromTabs])
    const dispatch = useDispatch()
    const [isGalleryOpen, setIsGalleryOpen] = useState(false)
    const [galleryImages, setGalleryImages] = useState<
        {
            image_url: string
            detected_class?: string[]
            type: "normal" | "trash"
        }[]
    >([])
    const [currentIndex, setCurrentIndex] = useState(0)

    const handleCameraCapture = (event) => {
        const files: File[] = Array.from(event.target.files)
        setImages((prev) => [...prev, ...files])
    }
    const removeImage = (indexToRemove: number) => {
        setImages((prev) => prev.filter((_, index) => index !== indexToRemove))
    }

    // ------------------------------
    // 🧹 Reset & Close
    // ------------------------------
    const resetReviewForm = () => {
        setStars(1)
        setLeaf(1)
        setComment("")
        setImages([])
        setIsModalOpen(false)
        if (fileInputRef.current) fileInputRef.current.value = ""
    }

    // ------------------------------
    // 💾 Submit review
    // ------------------------------
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
            resetReviewForm()
        } catch (err) {
            console.error("Error adding review", err)
        }
    }

    // ------------------------------
    // ⌨️ Keyboard navigation
    // ------------------------------
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (!isGalleryOpen) return
            if (e.key === "ArrowRight") {
                setCurrentIndex((prev) => (prev + 1) % galleryImages.length)
            }
            if (e.key === "ArrowLeft") {
                setCurrentIndex(
                    (prev) =>
                        (prev - 1 + galleryImages.length) % galleryImages.length
                )
            }
            if (e.key === "Escape") setIsGalleryOpen(false)
        }
        window.addEventListener("keydown", handleKey)
        return () => window.removeEventListener("keydown", handleKey)
    }, [isGalleryOpen, galleryImages.length])

    // ------------------------------
    // 🧮 Stats
    // ------------------------------
    const rating =
        reviews.reduce((acc, r) => acc + r.rating, 0) / (reviews.length || 1)
    const cleanliness =
        reviews.reduce((acc, r) => acc + r.cleanliness, 0) /
        (reviews.length || 1)

    const ratingDistribution = reviews.reduce(
        (acc, review) => {
            const r = review.cleanliness
            acc[r] = (acc[r] || 0) + 1
            return acc
        },
        {} as Record<number, number>
    )

    // =======================================================
    // ✨ UI STARTS
    // =======================================================
    return (
        <section className="max-w-6xl mx-auto px-4 py-10">
            {/* ------------------ Stats Header ------------------ */}
            <div className="flex flex-wrap justify-between items-center border-b-2 py-10 border-gray-100 mb-10 ">
                <div>
                    <h3 className="text-md font-bold">Total Reviews</h3>
                    <p className="text-3xl font-bold">{reviews.length}</p>
                </div>
                <div className="line h-32 bg-gray-200 w-[1px]"></div>
                <div>
                    <h3 className="text-md font-bold">
                        Average Rating & Cleanliness
                    </h3>
                    <div className="flex gap-4">
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
                <div className="line h-32 bg-gray-200 w-[1px]"></div>
                <div className="space-y-1 w-full mt-4 sm:mt-0 sm:w-auto">
                    {[5, 4, 3, 2, 1].map((star) => {
                        const count = ratingDistribution[star] || 0
                        const percentage = (count / (reviews.length || 1)) * 100
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

            {/* ------------------ Write Review Button ------------------ */}
            <div className="flex justify-end">
                <Button
                    onClick={() => {
                        if (!token) {
                            dispatch(openModal()) // Open login modal if user is not logged in
                            return
                        }
                        setIsModalOpen(true)
                    }}
                >
                    <Pen /> Write a Review
                </Button>
            </div>

            {/* ------------------ Reviews ------------------ */}
            <div className="">
                {[...reviews]
                    .sort(
                        (a, b) =>
                            new Date(b.timestamp).getTime() -
                            new Date(a.timestamp).getTime()
                    )
                    .map((review, index) => (
                        <div
                            key={index}
                            className="flex gap-32 border-b-2 border-gray-100 py-12"
                        >
                            {/* User info */}
                            <div className="flex w-1/3 gap-4">
                                <Image
                                    width={64}
                                    height={64}
                                    src={
                                        review.profile_image
                                            ? review.profile_image.startsWith(
                                                  "http"
                                              )
                                                ? review.profile_image // full URL from backend
                                                : `${process.env.NEXT_PUBLIC_API_URL}${review.profile_image}` // local uploads path
                                            : "/default.png" // fallback if none
                                    }
                                    alt={review.username || "User"}
                                    className="w-16 h-16 object-cover rounded-xl"
                                    onError={(e) => {
                                        // fallback if image fails to load
                                        ;(e.target as HTMLImageElement).src =
                                            "/default.png"
                                    }}
                                />
                                <div>
                                    <p className="font-semibold text-gray-900 w-full">
                                        {review.username}
                                    </p>
                                    <div className="flex gap-1">
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
                                    <div className="flex gap-1">
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

                            {/* Review content */}
                            <div className="w-2/3">
                                <div className="text-gray-400 text-xs mb-1">
                                    {new Date(review.timestamp).toLocaleString(
                                        undefined,
                                        {
                                            year: "numeric",
                                            month: "short",
                                            day: "2-digit",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            hour12: true,
                                        }
                                    )}
                                </div>
                                <p className="text-sm text-gray-700 mt-2 whitespace-pre-line">
                                    {review.comment}
                                </p>

                                {/* Trash warning */}
                                {review.trash_flag === 1 &&
                                    review.trash_data?.length > 0 && (
                                        <div
                                            onClick={() => {
                                                setGalleryImages(
                                                    review.trash_data.map(
                                                        (img) => ({
                                                            image_url:
                                                                img.image_url,
                                                            detected_class:
                                                                img.detected_class,
                                                            type: "trash",
                                                        })
                                                    )
                                                )
                                                setCurrentIndex(0)
                                                setIsGalleryOpen(true)
                                            }}
                                            className="bg-yellow-50 border-2 border-yellow-200 rounded-full px-4 items-center py-1 flex flex-row w-fit cursor-pointer hover:bg-yellow-100 mt-4"
                                        >
                                            <FaExclamationTriangle className="text-yellow-500 mr-2" />
                                            <p className="text-yellow-700 text-sm mr-1">
                                                Image contains trash.
                                            </p>
                                            <p className="text-sm font-bold text-yellow-700 underline">
                                                Click to view
                                            </p>
                                        </div>
                                    )}

                                {/* Review images */}
                                <div className="grid grid-cols-3 gap-2 mt-3">
                                    {review.images.map((image, index) => (
                                        <Image
                                            key={index}
                                            src={image}
                                            width={100}
                                            height={100}
                                            className="w-32 h-32 rounded-xl object-cover border-2 border-gray-100 p-2 cursor-pointer hover:opacity-80 transition"
                                            alt="review"
                                            onClick={() => {
                                                setGalleryImages(
                                                    review.images.map(
                                                        (img) => ({
                                                            image_url: img,
                                                            type: "normal",
                                                        })
                                                    )
                                                )
                                                setCurrentIndex(index)
                                                setIsGalleryOpen(true)
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
            </div>

            {/* ------------------ Gallery Modal (Normal + Trash) ------------------ */}
            {isGalleryOpen && galleryImages.length > 0 && (
                <div
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm"
                    onClick={() => setIsGalleryOpen(false)}
                >
                    <div
                        className="relative w-full max-w-5xl flex flex-col items-center gap-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setIsGalleryOpen(false)}
                            className="absolute top-6 right-6 text-white text-3xl hover:text-gray-400 transition"
                        >
                            <IoMdClose />
                        </button>

                        <Image
                            src={galleryImages[currentIndex].image_url}
                            alt={`Gallery-${currentIndex}`}
                            width={1000}
                            height={600}
                            className="object-contain w-full max-h-[80vh] rounded-xl"
                        />

                        <div className="flex justify-between items-center w-full text-white px-4">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setCurrentIndex(
                                        (prev) =>
                                            (prev - 1 + galleryImages.length) %
                                            galleryImages.length
                                    )
                                }}
                                className="text-3xl font-bold hover:text-yellow-400"
                            >
                                ‹
                            </button>

                            {/* Detected classes (for trash) */}
                            {/* {galleryImages[currentIndex].type === "trash" &&
                                galleryImages[currentIndex].detected_class && (
                                    <div className="text-center">
                                        <p className="text-yellow-400 font-semibold mb-1">
                                            Detected Items:
                                        </p>
                                        <p className="text-sm text-gray-200 italic">
                                            {galleryImages[
                                                currentIndex
                                            ].detected_class.join(", ") ||
                                                "Unknown object"}
                                        </p>
                                    </div>
                                )} */}

                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setCurrentIndex(
                                        (prev) =>
                                            (prev + 1) % galleryImages.length
                                    )
                                }}
                                className="text-3xl font-bold hover:text-yellow-400"
                            >
                                ›
                            </button>
                        </div>

                        {/* Count */}
                        <div className="absolute bottom-8 text-gray-300 text-sm">
                            {currentIndex + 1} / {galleryImages.length}
                        </div>
                    </div>
                </div>
            )}
            {/* ------------------ Write Review Modal ------------------ */}
            {isModalOpen && (
                <div
                    className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/60 px-4"
                    onClick={() => {
                        resetReviewForm()
                        setIsModalOpen(false)
                    }}
                >
                    <div
                        className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-xl space-y-4 text-left relative"
                        onClick={(e) => e.stopPropagation()}
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
                            Write a Review
                        </h2>

                        {/* Place Rating */}
                        <div>
                            <label className="text-sm font-semibold text-gray-700 mb-1 block">
                                Rate your experience
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

                        {/* Upload images */}
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

                            {/* Preview thumbnails */}
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

                        {/* Submit button */}
                        <div className="pt-2">
                            <Button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="w-full bg-black text-white py-3 rounded-full text-sm font-medium hover:bg-gray-900 transition flex items-center justify-center"
                            >
                                {isSubmitting && (
                                    <span className="animate-spin rounded-full h-4 w-4 border-2 border-t-transparent border-white mr-2"></span>
                                )}
                                {isSubmitting ? "Sending..." : "Send Review"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    )
}
