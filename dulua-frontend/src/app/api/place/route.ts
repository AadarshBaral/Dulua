import { NextRequest } from "next/server"

export const revalidate = 600

export async function GET(req: NextRequest) {
    const url = process.env.API_URL + "/place/add_review"
    try {
        const res = await fetch(url)
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
            JSON.stringify({ error: "Failed to to  create reply" }),
            { status: 500 }
        )
    }
}
