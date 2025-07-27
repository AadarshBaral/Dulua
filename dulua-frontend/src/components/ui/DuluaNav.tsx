"use client"
import React from "react"
import WeatherInfo from "./WeatherInfo"
import { Button } from "./button"
import { useAppDispatch, useAppSelector } from "@lib/hooks"
import { RootState } from "store/store"
import { openModal } from "store/appSlice/modalStore"
import { useRouter } from "next/router"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@lib/utils"
const DuluaNav = ({
    heroDetail = false,
    heroTitle = "Pokhara",
}: {
    heroDetail?: boolean
    heroTitle?: string
}) => {
    const [loggedIn, setLoggedIn] = React.useState(false)
    const modalOpen = useAppSelector(
        (state: RootState) => state.authModal.modalOpen
    )
    const pathname = usePathname()
    console.log(pathname)
    const user = useAppSelector((state: RootState) => state.auth.user)
    console.log(user)
    const dispatch = useAppDispatch()
    return (
        <div
            className={cn(
                "w-full flex justify-between items-start py-4  ",
                pathname === "/city-map" && "bg-green-300"
            )}
        >
            <Link
                href={"/"}
                className="navlogo flex justify-center items-center gap-2"
            >
                <div className="logo h-10 w-10 bg-neutral-300 rounded-md  "></div>
                <h1 className="text-xl font-bold">Dulua</h1>
            </Link>
            {pathname == "/" && (
                <div className="herodetail flex flex-col items-center gap-4">
                    <div className="discover">Discover</div>
                    <div className="city text-6xl font-semibold tracking-widest">
                        {heroTitle.toUpperCase()}
                    </div>
                    <WeatherInfo />
                </div>
            )}
            {user ? (
                <Link
                    href="/profile"
                    className="profile flex justify-center items-center gap-2"
                >
                    <div className="profileName text-sm font-semibold">
                        {user.username}
                    </div>
                    <div className="profille-img rounded-full h-8 w-8 bg-neutral-400"></div>
                </Link>
            ) : (
                <Button onClick={() => dispatch(openModal())}>Login</Button>
            )}
        </div>
    )
}

export default DuluaNav
