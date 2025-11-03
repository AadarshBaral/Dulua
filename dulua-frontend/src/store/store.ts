import { configureStore } from "@reduxjs/toolkit"
import authLayoutReducer from "./appSlice/modalStore"
import authSliceReducer from "./appSlice/authSlice"
import { api } from "./fetchReviews"
import { bookmarksApi } from "./fetchBookmarks"
export const makeStore = () => {
    return configureStore({
        reducer: {
            authModal: authLayoutReducer,
            auth: authSliceReducer,
            [api.reducerPath]: api.reducer, // ✅ Add API reducer
            [bookmarksApi.reducerPath]: bookmarksApi.reducer,
        },
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware()
                .concat(api.middleware)
                .concat(bookmarksApi.middleware), // ✅ Add API middleware
    })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>
export type AppDispatch = AppStore["dispatch"]
