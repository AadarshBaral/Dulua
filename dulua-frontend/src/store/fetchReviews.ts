import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { RootState } from "./store"
// Adjust path to your store

export const api = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.API_URL || "http://localhost:8000",
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).auth.token
            if (token) {
                headers.set("Authorization", `bearer ${token}`)
            }
            return headers
        },
    }),
    tagTypes: ["Reviews"],
    endpoints: (builder) => ({
        getReviews: builder.query<any, string>({
            query: (placeId) => `/place/get_reviews/${placeId}`,
            providesTags: (result, error, placeId) => [
                { type: "Reviews", id: placeId },
            ],
        }),
        addReview: builder.mutation<any, FormData>({
            query: (formData) => ({
                url: "/place/add_review",
                method: "POST",
                body: formData,
            }),
            invalidatesTags: (result, error, formData) => [
                { type: "Reviews", id: formData.get("place_id") as string },
            ],
        }),
    }),
})
export const { useGetReviewsQuery, useAddReviewMutation } = api
