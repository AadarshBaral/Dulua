import { createSlice } from "@reduxjs/toolkit"

interface IAuthLayoutState {
    modalOpen: boolean
}
const initialState: IAuthLayoutState = {
    modalOpen: false,
}

export const authLayoutSlice = createSlice({
    name: "authLayout",
    initialState,
    reducers: {
        openModal: (state) => {
            state.modalOpen = true
        },
        closeModal: (state) => {
            state.modalOpen = false
        },
    },
})

// Action creators are generated for each case reducer function
export const { openModal, closeModal } = authLayoutSlice.actions

export default authLayoutSlice.reducer
