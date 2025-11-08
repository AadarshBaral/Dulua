import { NextResponse } from "next/server"

export async function GET() {
    const response = NextResponse.json({ message: "Logged out successfully" })

    // ✅ Clear cookies by overwriting with empty values
    response.cookies.set("token", "", { maxAge: 0, path: "/" })
    response.cookies.set("refresh_token", "", { maxAge: 0, path: "/" })

    return response
}
