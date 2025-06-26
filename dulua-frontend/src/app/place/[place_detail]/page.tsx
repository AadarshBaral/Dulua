"use client"
import Review from "@components/ui/review"
import React from "react"

interface Props {
    params: Promise<{ place_detail: string }>
}

export default async function PlaceDetail({ params }: Props) {
    const { place_detail } = await params
    console.log("hello place")
    return (
        <>
            <h1>PlaceDetail</h1>
            <Review />
        </>
    )
}
