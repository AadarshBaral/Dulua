import React from "react"

interface Props {
    params: Promise<{ place_detail: string }>
}

export default async function PlaceDetail({ params }: Props) {
    const { place_detail } = await params

    return <div>Place Detail {place_detail}</div>
}
