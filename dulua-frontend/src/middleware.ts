import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { jwtDecode } from "jwt-decode"

export async function middleware(request: Request) {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")
    console.log("heil", token)
    if (!token) {
        return NextResponse.redirect(new URL("/", request.url))
    }

    try {
        // Decode the JWT token safely
        const decoded: any = jwtDecode(token.value)

        // Ensure the decoded token contains a valid 'role' property
        const userRole = decoded?.role

        if (!userRole) {
            console.error("Role not found in decoded token.")
            return NextResponse.redirect(new URL("/", request.url))
        }

        console.log("Decoded role:", userRole)

        // Check if the user has an 'admin' role
        if (userRole !== "admin") {
            return NextResponse.redirect(new URL("/", request.url))
        }

        return NextResponse.next() // Proceed with the request if user is admin
    } catch (error) {
        console.error("Error decoding token:", error)
        return NextResponse.redirect(new URL("/", request.url)) // Redirect if there's an error
    }
}

export const config = {
    matcher: "/admin/:path*",
}
