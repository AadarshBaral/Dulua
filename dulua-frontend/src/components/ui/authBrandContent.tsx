import Image from "next/image"
import React from "react"

const AuthBrandContent = () => {
    return (
        <div className="brand-content w-[50%] bg-gray-100 rounded-xl my-10">
            <Image
                className="object-cover w-full h-full rounded-xl"
                src="/pokhara.png"
                width={500}
                height={500}
                alt="Pokhara Logo"
            />
        </div>
    )
}

export default AuthBrandContent
