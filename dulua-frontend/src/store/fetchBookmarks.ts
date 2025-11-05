import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { RootState } from "./store"

export const bookmarksApi = createApi({
    reducerPath: "bookmarksApi",
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
    tagTypes: ["Bookmarks"],
    endpoints: (builder) => ({
        // ✅ Get all bookmarks for the logged-in user
        getBookmarks: builder.query<any[], void>({
            query: () => `/place/bookmarks`, // fixed path
            providesTags: ["Bookmarks"],
        }),

        // ✅ Toggle bookmark on/off with optimistic update
        toggleBookmark: builder.mutation<
            { message: string; place_id: string },
            { place_id: string }
        >({
            query: (body) => ({
                url: `/place/bookmark`, // fixed toggle route
                method: "POST",
                body,
            }),

            // 🔥 Optimistic cache update for instant UI refresh
            async onQueryStarted({ place_id }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    bookmarksApi.util.updateQueryData(
                        "getBookmarks",
                        undefined,
                        (draft) => {
                            const exists = draft.find(
                                (b) => b.place_id === place_id
                            )
                            if (exists) {
                                // remove instantly
                                return draft.filter(
                                    (b) => b.place_id !== place_id
                                )
                            } else {
                                // add instantly
                                draft.push({ place_id })
                            }
                        }
                    )
                )

                try {
                    await queryFulfilled
                } catch {
                    patchResult.undo() // rollback on failure
                }
            },

            invalidatesTags: ["Bookmarks"],
        }),
    }),
})

export const { useGetBookmarksQuery, useToggleBookmarkMutation } = bookmarksApi
