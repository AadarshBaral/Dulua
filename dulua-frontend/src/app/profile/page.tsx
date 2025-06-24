"use client"
import { useAppSelector } from "@lib/hooks"
import React from "react"
import { RootState } from "store/store"

const page = () => {
    const user = useAppSelector((state: RootState) => state.auth.user)
    return <div>Profile Page {user?.username}</div>
}

export default page
