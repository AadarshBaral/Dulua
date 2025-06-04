import Link from "next/link"

export default function Page() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12 sm:px-6 lg:px-8">
            <h1 className="text-4xl text-green-900">Hello, Dulua</h1>;
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
        </div>
    )
}
