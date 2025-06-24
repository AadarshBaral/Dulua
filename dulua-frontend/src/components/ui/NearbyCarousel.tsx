import React from "react"

const NearbyCarousel = () => {
    return (
        <div className="relative p-4">
            {/* Header */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-white rounded-full px-4 py-1 shadow text-sm flex items-center gap-2">
                <span className="text-red-500">📍</span>
                <span>While you are around Lamachaur</span>
            </div>

            <div className="flex gap-4 mt-8">
                {/* Left Card */}
                <div className="relative w-1/2 rounded-2xl overflow-hidden">
                    <img
                        src="https://via.placeholder.com/300x200?text=Bat+Cave"
                        alt="Bat Cave"
                        className="w-full h-full object-cover"
                    />
                    <button className="absolute top-1/2 left-2 -translate-y-1/2 bg-white rounded-full p-1 shadow">
                        ←
                    </button>
                    <div className="absolute bottom-0 w-full bg-black bg-opacity-50 text-white p-4">
                        <h3 className="font-semibold">Bat Cave</h3>
                        <p className="text-sm">Dare to explore?</p>
                    </div>
                </div>

                {/* Right Card */}
                <div className="relative w-1/2 rounded-2xl overflow-hidden">
                    <img
                        src="https://via.placeholder.com/300x200?text=Gandaki+Trout+Farm"
                        alt="Gandaki Trout Farm"
                        className="w-full h-full object-cover"
                    />
                    <button className="absolute top-1/2 right-2 -translate-y-1/2 bg-white rounded-full p-1 shadow">
                        →
                    </button>
                    <div className="absolute bottom-0 w-full bg-black bg-opacity-50 text-white p-4">
                        <h3 className="font-semibold">Gandaki Trout Farm</h3>
                        <p className="text-sm">Try fried trout.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NearbyCarousel
