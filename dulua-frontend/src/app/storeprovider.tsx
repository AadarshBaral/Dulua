"use client"

import { useEffect, useRef } from "react"
import { Provider } from "react-redux"
import { AppStore, makeStore } from "store/store"
import { rehydrate, fetchUserProfile, logout } from "store/appSlice/authSlice"
import { jwtDecode } from "jwt-decode"

export default function StoreProvider({
    children,
}: {
    children: React.ReactNode
}) {
    const storeRef = useRef<AppStore | null>(null)
    if (!storeRef.current) {
        storeRef.current = makeStore()
    }

    const store = storeRef.current
    const isTokenExpired = (token: string): boolean => {
        try {
            const decoded: any = jwtDecode(token)
            const expirationTime = decoded.exp * 1000 // Convert to milliseconds
            const currentTime = new Date().getTime()
            return currentTime > expirationTime
        } catch (e) {
            return true // If there's an error decoding, assume the token is expired
        }
    }
    useEffect(() => {
        store.dispatch(rehydrate())

        const state = store.getState()
        const token = state.auth.token
        const tokenType = state.auth.tokenType || "bearer"

        if (token && !state.auth.user) {
            store.dispatch(fetchUserProfile({ token, tokenType }))
        }
        if (token && isTokenExpired(token)) {
            // Dispatch the logout action to clear the token from Redux and localStorage
            store.dispatch(logout())
        }
    }, [store])

    return <Provider store={store}>{children}</Provider>
}
