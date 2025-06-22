import React from "react"

const WeatherInfo = () => {
    return (
        <div className="flex items-center gap-2 text-lg">
            <span className="font-semibold">33°</span>
            <span className="text-gray-500">|</span>
            <span>Sunny</span>
            <span className="text-gray-500">|</span>
            <div className="flex items-center gap-1">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    className="lucide lucide-cloud-drizzle-icon lucide-cloud-drizzle"
                >
                    <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
                    <path d="M8 19v1" />
                    <path d="M8 14v1" />
                    <path d="M16 19v1" />
                    <path d="M16 14v1" />
                    <path d="M12 21v1" />
                    <path d="M12 16v1" />
                </svg>
                <span>60%</span>
            </div>
        </div>
    )
}

export default WeatherInfo
