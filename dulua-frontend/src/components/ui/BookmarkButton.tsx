"use client"
import React, { useState } from "react"

import { Button } from "./button"
import { Heart } from "lucide-react"
import { IconHeartFilled } from "@tabler/icons-react"
import { cn } from "@lib/utils"

const BookmarkButton = () => {
    const [bookmark, setBookmark] = useState(false)
    return (
        <Button
            className={cn(
                "hover:bg-transparent w-28",
                !bookmark && " hover:text-accent"
            )}
            variant={"outline"}
            onClick={() => setBookmark((prev) => !prev)}
        >
            {bookmark ? <IconHeartFilled className="text-accent" /> : <Heart />}
            {bookmark ? <p>Saved</p> : <p>Save</p>}
        </Button>
    )
}

export default BookmarkButton
