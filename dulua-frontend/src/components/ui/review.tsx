"use client"
import React, { useRef } from "react"

const Review = () => {
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleCameraCapture = (event) => {
        const file = event.target.files[0]
        if (file) {
            console.log("File selected:", file)
        }
    }
    return (
        <>
            <input
                ref={fileInputRef}
                onChange={handleCameraCapture}
                type="file"
                accept="image/*"
                capture="environment"
            ></input>
        </>
    )
}

export default Review
