"use client"
import { CiCloud } from "react-icons/ci"

import { useEffect, useState } from "react"

interface WeatherData {
    current?: {
        temp_c: number
        condition: {
            text: string
            icon: string
        }
        humidity: number
    }
}

const WeatherInfo = () => {
    const [weather, setWeather] = useState<WeatherData | null>(null)

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const res = await fetch("/api/weather?city=Pokhara")
                const data = await res.json()
                setWeather(data)
            } catch (error) {
                console.error("Error fetching weather:", error)
            }
        }

        fetchWeather()
    }, [])

    return (
        <div className="flex items-center gap-2 text-lg">
            <span className="font-semibold">
                {weather?.current?.temp_c !== undefined
                    ? weather?.current?.temp_c
                    : "~"}
                °C
            </span>
            <span className="text-gray-500">|</span>
            <span>{weather?.current?.condition?.text ?? "~"}</span>
            <span className="text-gray-500">|</span>
            <div className="flex items-center gap-1">
                <CiCloud />

                {/* @ts-ignore */}
                <span> {weather?.current?.cloud ?? "~"}%</span>
            </div>
        </div>
    )
}

export default WeatherInfo
