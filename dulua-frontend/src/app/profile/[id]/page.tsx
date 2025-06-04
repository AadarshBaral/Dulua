import React from "react"

interface Props {
    params: Promise<{ id: string }>
}

export default async function ProfilePage({ params }: Props) {
    const { id } = await params

    return <div>Profile Page {id}</div>
}
