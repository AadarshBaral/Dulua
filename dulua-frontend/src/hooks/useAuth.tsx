// hooks/useAuth.ts

import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { openModal } from "store/appSlice/modalStore"
import { useRouter } from "next/navigation"

const useAuthCheck = () => {
    const dispatch = useDispatch()
    const router = useRouter()

    useEffect(() => {
        const token = localStorage.getItem("token")

        // If no token, show login form
        if (!token) {
            dispatch(openModal()) // Dispatch to open the login modal
        } else {
            // Optionally, you can verify the token here using a backend API or JWT library
            const decodedToken = decodeToken(token) // Implement your token decoding here

            // Check if token is expired or invalid
            if (decodedToken && isTokenExpired(decodedToken)) {
                dispatch(openModal()) // Show login if token is expired
            } else {
                // You can also redirect to home page if already logged in
                router.push("/dashboard") // Redirect user to a different page if authenticated
            }
        }
    }, [dispatch, router])
}

// Utility function to decode JWT token and check expiration
const decodeToken = (token: string) => {
    try {
        const decoded = JSON.parse(atob(token.split(".")[1]))
        return decoded
    } catch (error) {
        console.error("Invalid token")
        return null
    }
}

// Utility function to check if the token is expired
const isTokenExpired = (decodedToken: any) => {
    if (!decodedToken?.exp) return true
    const currentTime = Math.floor(Date.now() / 1000)
    return decodedToken.exp < currentTime
}

export default useAuthCheck
