"use client"

import React, { useEffect, useState } from "react"
import { FaLeaf } from "react-icons/fa6"
import PlaceCard from "./PlaceCard"
import { useAppDispatch } from "@lib/hooks"
import { logout } from "store/appSlice/authSlice"
import { redirect } from "next/navigation"
import { bookmarksApi, useGetBookmarksQuery } from "store/fetchBookmarks"
import { useRouter } from "next/navigation"

const API_BASE = process.env.NEXT_PUBLIC_API_URL // e.g. http://localhost:8000

const UserProfileTabs = ({ user }: { user: any }) => {
    const [previewImage, setPreviewImage] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [profile, setProfile] = useState<any>(null)
    const [loadingProfile, setLoadingProfile] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const dispatch = useAppDispatch()
    const router = useRouter()
    const { data: bookmarks = [], isLoading, isError } = useGetBookmarksQuery()

    // ✅ Fetch full user profile info by user.id
    useEffect(() => {
        if (!user?.id) return

        const fetchProfile = async () => {
            try {
                const res = await fetch(`${API_BASE}/user/${user.id}`)
                if (!res.ok) throw new Error("Failed to fetch user profile")
                const data = await res.json()
                setProfile(data)
            } catch (err: any) {
                console.error(err)
                setError(err.message)
            } finally {
                setLoadingProfile(false)
            }
        }

        fetchProfile()
    }, [user?.id])

    const handleLogout = async () => {
        try {
            await fetch("/api/logout", { method: "GET" })
            localStorage.removeItem("token")
            sessionStorage.clear()
            dispatch(logout())
            dispatch(bookmarksApi.util.resetApiState())
            router.push("/")
        } catch (err) {
            console.error("Logout failed:", err)
        }
    }

    // ✅ Handle image change and upload
    const handleImageChange = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0]
        if (!file) return

        const formData = new FormData()
        formData.append("image", file)
        setLoading(true)

        try {
            const res = await fetch(`${API_BASE}/user/${user.id}`, {
                method: "PUT",
                body: formData,
            })

            if (!res.ok) throw new Error("Failed to upload image")

            const updated = await res.json()
            setPreviewImage(`${API_BASE}${updated.image}`)
            alert("Profile image uploaded successfully!")
        } catch (err) {
            console.error(err)
            alert("Failed to upload image.")
        } finally {
            setLoading(false)
        }
    }

    // ✅ Loading and error states
    if (loadingProfile) {
        return <p className="text-gray-400 italic p-6">Loading profile...</p>
    }

    if (error) {
        return <p className="text-red-500 italic p-6">Error: {error}</p>
    }

    // ✅ Render profile header + favorites
    return (
        <div className="flex flex-col mx-4 my-4">
            {/* Logout */}
            <p
                className="self-end text-red-500 cursor-pointer"
                onClick={() => {
                    handleLogout()
                }}
            >
                Logout
            </p>

            {/* Header Section */}
            <div className="flex space-x-4 p-3 h-auto">
                <div className="relative group">
                    <img
                        className="w-[140px] h-[140px] rounded-full object-cover"
                        src={
                            previewImage ||
                            (profile?.image?.startsWith("http")
                                ? profile.image
                                : `${API_BASE}${profile?.image}`) ||
                            "/default.png"
                        }
                        alt="profile"
                    />
                    <label className="absolute bottom-0 right-0 bg-green-700 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition cursor-pointer">
                        {loading ? "Updating..." : "Change"}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                        />
                    </label>
                </div>

                <div className="flex flex-col">
                    <h1 className="text-[24px]">
                        {user?.username ?? "Anonymous"}
                    </h1>
                    <p className="text-[14px] font-light">
                        {profile?.handle ?? "@handle"}
                    </p>

                    <div className="mt-[11px] flex space-x-6">
                        <div>
                            <h3 className="text-[14px]">Contribution</h3>
                            <p className="text-[32px] font-semibold">
                                {profile?.contribution ?? 0}
                            </p>
                        </div>
                        <div>
                            <h3 className="text-[14px]">Green Points</h3>
                            <div className="flex items-center space-x-1">
                                <p className="text-[32px] font-semibold">
                                    {profile?.green_points ?? 0}
                                </p>
                                <FaLeaf className="text-green-600" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ✅ Favorites Section (Only visible section now) */}
            <div className="my-16">
                <p className="text-2xl font-semibold mb-6">Favorites</p>

                {isLoading ? (
                    <p className="text-gray-400 italic">
                        Loading your favorites...
                    </p>
                ) : isError ? (
                    <div className="flex flex-col items-center justify-center text-center py-16">
                        <img
                            src="/empty-favorites.svg"
                            alt="Empty"
                            className="w-40 h-40 opacity-70 mb-6"
                        />
                        <h2 className="text-lg font-semibold text-gray-700 mb-2">
                            Oops! Couldn’t load your favorites 💔
                        </h2>
                        <p className="text-gray-500 text-sm max-w-md">
                            Please refresh the page or check your connection.
                        </p>
                    </div>
                ) : bookmarks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-center py-16">
                        <img
                            src="/empty-favorites.svg"
                            alt="No favorites yet"
                            className="w-40 h-40 opacity-70 mb-6"
                        />
                        <h2 className="text-lg font-semibold text-gray-700 mb-2">
                            No favorites yet ❤️
                        </h2>
                        <p className="text-gray-500 text-sm max-w-md">
                            Start exploring and save the places you love to find
                            them here later.
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-wrap gap-6">
                        {bookmarks.map((place, index) => (
                            <PlaceCard key={index} place={place} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default UserProfileTabs
