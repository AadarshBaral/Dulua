import Image from "next/image"
import React from "react"

const AuthLogo = () => {
    return (
        <div className="logo  rounded-md overflow-hidden flex items-center justify-start mb-4">
            <Image
                src="/logo/primary-solid-circle.png" // ✅ put your image in /public/logo.png
                alt="Dulua Logo"
                width={60}
                height={60}
                className="object-cover" // ensures it fits nicely inside the div
                priority // loads it immediately for faster nav
            />
        </div>
    )
}

export default AuthLogo
