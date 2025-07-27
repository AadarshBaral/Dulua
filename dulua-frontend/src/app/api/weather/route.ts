// src/app/api/weather/route.ts
import { NextRequest } from "next/server"

export const dynamic = "force-dynamic" // for dynamic route
export const revalidate = 600 // cache for 600 seconds (10 mins)

export async function GET(req: NextRequest) {
    const city = req.nextUrl.searchParams.get("city") || "Pokhara"
    const apiKey = process.env.WEATHER_API
    const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`

    try {
        const res = await fetch(url, {
            // Enable Next.js-level caching (ISR)
            next: { revalidate: 600 },
        })
        const data = await res.json()

        if (!res.ok) {
            return new Response(JSON.stringify(data), { status: res.status })
        }

        return new Response(JSON.stringify(data), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        })
    } catch (error) {
        return new Response(
            JSON.stringify({ error: "Failed to fetch weather data" }),
            { status: 500 }
        )
    }
}
