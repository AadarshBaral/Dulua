"use client"
import AuthLayout from "@components/auth/authLayout"
import { Button } from "@components/ui/button"
import { cn } from "@lib/utils"
import Link from "next/link"
import { useDispatch } from "react-redux"
import { openModal } from "store/appSlice/authLayout"

export default function Page() {
    const dispatch = useDispatch()

    return (
        <div
            className={cn(
                "flex flex-col items-center justify-center min-h-screen px-4 py-12 sm:px-6 lg:px-8"
            )}
        >
            <h1 className="text-4xl text-green-900">
                Hello, Dulua Lorem ipsum dolor, sit amet consectetur adipisicing
                elit. Quas aperiam dolore rem harum, molestias rerum iure et
                architecto tempore quasi possimus officia non. Quas reiciendis
                nostrum minima autem deleniti iusto asperiores iste quaerat
                expedita dolore! Adipisci, aperiam. Maxime labore culpa quisquam
                reiciendis consequatur ipsa atque modi voluptatum. Minima odio
                excepturi error labore ab dolorum quasi harum? Exercitationem
                iste voluptate nam vero. Fugiat inventore at perferendis cum hic
                nesciunt, architecto nihil necessitatibus ex sapiente sed enim,
                incidunt fugit rem dignissimos eligendi eos. Facere sapiente,
                optio, quibusdam officiis nostrum, ratione ipsam aspernatur sed
                reprehenderit deserunt molestiae modi eum culpa tenetur. Labore,
                nesciunt!
            </h1>
            ;
            <Link href="/profile/1">
                <p>To Profile</p>
            </Link>
            <Link href="place/davis-falls">
                <p>To Davis Falls</p>
            </Link>
            <Link href="place/kahun-dada">
                <p>To Kahun Data</p>
            </Link>
            <Link href="/city-map/">
                <p>City Map</p>
            </Link>
            <Button onClick={() => dispatch(openModal())}>Hello</Button>
        </div>
    )
}
