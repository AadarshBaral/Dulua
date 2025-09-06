"use client"

import React, { useState } from "react"
import { FaLeaf } from "react-icons/fa6"
import SliderComponent from "@components/ui/SliderComponent"
import PersonalInformationForm from "./PersonalInformation"
import PlaceCard from "./PlaceCard"
import { useAppDispatch } from "@lib/hooks"
import { logout } from "store/appSlice/authSlice"
import { redirect, RedirectType } from "next/navigation"

const UserProfileTabs = ({ user, places }: { user: any; places: any[] }) => {
    const [activeTab, setActiveTab] = useState("favorite")
    const dispatch = useAppDispatch()

    return (
        <div className="flex flex-col mx-4 my-4">
            <p
                className="self-end text-red-500 cursor-pointer"
                onClick={() => {
                    dispatch(logout())
                    redirect("/")
                }}
            >
                Logout
            </p>
            {/* Top Section */}
            <div className="flex space-x-4 p-3 h-auto">
                <img
                    className="w-[140px] h-[140px] rounded-full"
                    src="/default.png"
                    alt="profile"
                />
                <div className="flex flex-col">
                    <h1 className="text-[24px]">
                        {user?.username ?? "Anonymous"}
                    </h1>
                    <p className="text-[14px] font-light">@handle</p>
                    <div className="mt-[11px] flex space-x-4">
                        <div>
                            <h3 className="text-[14px]">Contribution</h3>
                            <p className="text-[32px]">28</p>
                        </div>
                        <div>
                            <h3 className="text-[14px]">Green Points</h3>
                            <div className="flex items-center space-x-1">
                                <p className="text-[32px]">500</p>
                                <FaLeaf className="text-green-600" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex space-x-[39px] ">
                <button
                    onClick={() => setActiveTab("favorite")}
                    className={`${
                        activeTab === "favorite"
                            ? "font-semibold border-b-2 border-green-800 text-green-600"
                            : "text-neutral-500"
                    }`}
                >
                    Favorite
                </button>
                <button
                    onClick={() => setActiveTab("personal information")}
                    className={`${
                        activeTab === "personal information"
                            ? "font-semibold border-b-2 border-green-800 text-green-600"
                            : "text-neutral-500"
                    }`}
                >
                    Personal Information
                </button>
            </div>

            {activeTab === "favorite" && (
                <div className="my-10">
                    <p className="text-2xl font-semibold my-10">Favorites</p>
                    <div className="cont flex flex-wrap gap-6 ">
                        {places?.map((place, index) => (
                            <PlaceCard key={index} place={place} />
                        ))}
                    </div>
                </div>
            )}
            {activeTab === "personal information" && (
                <PersonalInformationForm />
            )}
        </div>
    )
}

export default UserProfileTabs
