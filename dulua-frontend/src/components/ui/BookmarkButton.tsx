"use client"

import { useEffect, useState } from "react"
import { Button } from "./button"
import { Heart } from "lucide-react"
import { IconHeart, IconHeartFilled } from "@tabler/icons-react"
import { cn } from "@lib/utils"
import {
    useToggleBookmarkMutation,
    useGetBookmarksQuery,
} from "store/fetchBookmarks"

const BookmarkButton = ({ place_id }: { place_id: string }) => {
    const [bookmark, setBookmark] = useState(false)
    const [toggleBookmark, { isLoading }] = useToggleBookmarkMutation()
    const { data: bookmarks } = useGetBookmarksQuery()

    // ✅ Set initial state from bookmark list
    useEffect(() => {
        if (bookmarks && Array.isArray(bookmarks)) {
            const isSaved = bookmarks.some((b) => b.place_id === place_id)
            setBookmark(isSaved)
        }
    }, [bookmarks, place_id])

    const handleToggle = async (e: React.MouseEvent) => {
        e.stopPropagation()
        if (isLoading) return

        try {
            setBookmark((prev) => !prev) // Optimistic toggle
            await toggleBookmark({ place_id }).unwrap()
        } catch (err) {
            console.error("Bookmark toggle failed:", err)
            setBookmark((prev) => !prev) // rollback on failure
        }
    }

    return (
        <button
            className={cn(
                "bg-white/60 border-0 hover:bg-white/90 p-2 rounded-full cursor-pointer transition flex justify-center items-center"
            )}
            disabled={isLoading}
            onClick={handleToggle}
        >
            {bookmark ? (
                <IconHeartFilled size={20} className="  text-accent" />
            ) : (
                <IconHeart size={20} className="text-gray-700 " />
            )}
        </button>
    )
}

export default BookmarkButton
