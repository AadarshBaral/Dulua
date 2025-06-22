import { createSlice } from "@reduxjs/toolkit"

interface IModalState {
    modalOpen: boolean
}
const initialState: IModalState = {
    modalOpen: false,
}

export const authModalSlice = createSlice({
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
export const { openModal, closeModal } = authModalSlice.actions

export default authModalSlice.reducer
