"use client"

import { useAppSelector } from "@lib/hooks"
import { RootState } from "store/store"
import UserProfileTabs from "./UserProfileTabs"

const UserProfile = () => {
    const user = useAppSelector((state: RootState) => state.auth.user)
    console.log("here is your user", user)
    return (
        <div className="relative h-[200vh]">
            {/* Background image */}
            <div className="w-full h-[246px] rounded-lg">
                <img
                    src="/pokhara.png"
                    alt="background"
                    className="w-full h-full object-cover rounded-2xl"
                />
            </div>

            {/* Main Card */}

            <div className="absolute w-[500px]   md:w-[600px] lg:w-[1080px] h-[230px] top-[158px] left-[50%] transform -translate-x-1/2 flex flex-col border-[1px] rounded-[32px] bg-white/85">
                <UserProfileTabs user={user} />
            </div>
        </div>
    )
}

export default UserProfile
