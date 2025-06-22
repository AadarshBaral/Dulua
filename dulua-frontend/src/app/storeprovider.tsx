"use client"

import { useEffect, useRef } from "react"
import { Provider } from "react-redux"
import { AppStore, makeStore } from "store/store"
import { rehydrate, fetchUserProfile } from "store/appSlice/authSlice"

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

    useEffect(() => {
        store.dispatch(rehydrate())

        const state = store.getState()
        const token = state.auth.token
        const tokenType = state.auth.tokenType || "bearer"

        if (token && !state.auth.user) {
            store.dispatch(fetchUserProfile({ token, tokenType }))
        }
    }, [store])

    return <Provider store={store}>{children}</Provider>
}
