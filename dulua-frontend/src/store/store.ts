import { configureStore } from "@reduxjs/toolkit"
import authLayoutReducer from "./appSlice/modalStore"
import authSliceReducer from "./appSlice/authSlice"
export const makeStore = () => {
    return configureStore({
        reducer: {
            authModal: authLayoutReducer,
            auth: authSliceReducer,
        },
    })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>
export type AppDispatch = AppStore["dispatch"]
