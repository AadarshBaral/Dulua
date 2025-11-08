import { loginUserFunc } from "@api/auth"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { RootState } from "store/store"

interface IUser {
    id: string
    username: string
    email: string
    handle?: string
}

interface IAuthState {
    token: string | null
    tokenType: string | null
    user: IUser | null
    loading: boolean
    error: string | null
}
const loadFromLocalStorage = (key: string): string | null => {
    if (typeof window !== "undefined") {
        return localStorage.getItem(key)
    }
    return null
}

const loadUserFromLocalStorage = (): IUser | null => {
    if (typeof window !== "undefined") {
        const userStr = localStorage.getItem("user")
        if (userStr) {
            try {
                return JSON.parse(userStr)
            } catch {
                return null
            }
        }
    }
    return null
}

const initialState: IAuthState = {
    token: loadFromLocalStorage("token"),
    tokenType: loadFromLocalStorage("tokenType"),
    user: loadUserFromLocalStorage(),
    loading: false,
    error: null,
}

export const loginUser = createAsyncThunk<
    { access_token: string; token_type: string },
    { username: string; password: string },
    { rejectValue: string }
>("auth/loginUser", async ({ username, password }, thunkAPI) => {
    try {
        // Use the loginUserFunc imported function
        const { status, data } = await loginUserFunc({
            data: { username, password }, // Pass username and password to loginUserFunc
        })

        // Check if the response status is not OK
        if (status !== 200) {
            return thunkAPI.rejectWithValue(data.detail || "Login failed")
        }

        // Check if the token is missing from the response
        if (!data.access_token) {
            return thunkAPI.rejectWithValue("Token not found in response")
        }

        // Return the tokens if everything is successful
        return { access_token: data.access_token, token_type: data.token_type }
    } catch (err) {
        console.error("Login error", err)
        return thunkAPI.rejectWithValue("Network error")
    }
})

export const fetchUserProfile = createAsyncThunk<
    IUser,
    { token: string; tokenType: string },
    { rejectValue: string }
>("auth/fetchUserProfile", async ({ token, tokenType }, thunkAPI) => {
    try {
        console.log("trying ...")
        const res = await fetch("http://localhost:8000/auth/get-user", {
            method: "GET",
            headers: {
                Authorization: `${tokenType} ${token}`,
            },
        })

        const data = await res.json()
        console.log("Fetched user data:", data)
        if (!res.ok) {
            return thunkAPI.rejectWithValue(
                data.detail || "Failed to fetch user"
            )
        }

        // return everything you need from backend
        return {
            id: data.id,
            username: data.username,
            email: data.email,
            handle: data.handle, // optional
        }
    } catch (err) {
        console.error("Fetch user error", err)
        return thunkAPI.rejectWithValue("Network error")
    }
})

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout(state) {
            state.token = null
            state.tokenType = null
            state.user = null
            state.error = null
            localStorage.removeItem("token")
            localStorage.removeItem("email")
            localStorage.removeItem("tokenType")
            localStorage.removeItem("user")
        },
        rehydrate(state) {
            state.token = loadFromLocalStorage("token")
            state.tokenType = loadFromLocalStorage("tokenType")
            state.user = loadUserFromLocalStorage()
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false
                state.token = action.payload.access_token
                state.tokenType = action.payload.token_type
                localStorage.setItem("token", action.payload.access_token)
                localStorage.setItem("tokenType", action.payload.token_type)
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload ?? "Login failed"
                localStorage.removeItem("token")
                localStorage.removeItem("tokenType")
                localStorage.removeItem("user")
            })
            .addCase(fetchUserProfile.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                state.loading = false
                state.user = action.payload
                localStorage.setItem("user", JSON.stringify(action.payload))
            })
            .addCase(fetchUserProfile.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload ?? "Failed to fetch user"
            })
    },
})

export const { logout, rehydrate } = authSlice.actions
export default authSlice.reducer
