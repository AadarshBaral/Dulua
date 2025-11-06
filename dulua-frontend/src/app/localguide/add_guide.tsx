"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useSelector } from "react-redux"
import { fetchPlaces, IPlace } from "@api/core"

const localGuideSchema = z.object({
    id_image1: z
        .any()
        .refine((files) => files?.length === 1, "Please upload ID Image 1"),
    id_image2: z
        .any()
        .refine((files) => files?.length === 1, "Please upload ID Image 2"),
    age: z
        .number({
            required_error: "Age is required",
            invalid_type_error: "Age must be a number",
        })
        .refine((val) => val >= 18 && val <= 80, "Age must be between 18–80"),
    address: z.string().min(3, "Address required"),
    contact: z.string().regex(/^[0-9]{7,15}$/, "Invalid contact number"),
    place_id: z.string().uuid("Please select a valid place"),
})

type LocalGuideFormData = z.infer<typeof localGuideSchema>

export default function LocalGuideForm({ places }: { places: IPlace[] }) {
    const router = useRouter()
    console.log("Places received in LocalGuideForm:", places)
    // ✅ Get user info from Redux
    const { username, email } =
        useSelector((state: any) => state.auth.user) || {}

    const [loading, setLoading] = useState(false)
    const [errorMsg, setErrorMsg] = useState<string | null>(null)

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<LocalGuideFormData>({
        resolver: zodResolver(localGuideSchema),
    })

    const onSubmit = async (data: LocalGuideFormData) => {
        setLoading(true)
        setErrorMsg(null)

        const formData = new FormData()
        formData.append("id_image1", data.id_image1[0])
        formData.append("id_image2", data.id_image2[0])
        formData.append("name", username) // ✅ pulled from Redux
        formData.append("age", String(data.age))
        formData.append("address", data.address)
        formData.append("contact", data.contact)
        formData.append("email", email) // ✅ pulled from Redux
        formData.append("place_id", data.place_id)
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/local_guide/add`,
                {
                    method: "POST",
                    body: formData,
                    headers: {
                        Authorization: `bearer ${localStorage.getItem("token") || ""}`,
                    },
                }
            )

            if (res.ok) {
                reset()
                router.push("/localguide/thankyou")
            } else {
                const result = await res.json()
                setErrorMsg(result.detail || "Something went wrong")
            }
        } catch (error) {
            console.error(error)
            setErrorMsg("Network error or server unreachable")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-xl p-6 mt-6">
            <h2 className="text-2xl font-bold mb-4 text-center text-gray-700">
                Register as Local Guide
            </h2>

            {/* ✅ Show logged-in user info (not editable) */}
            <div className="bg-gray-50 border rounded-md p-3 mb-4">
                <p className="text-gray-700">
                    <strong>Name:</strong> {username || "Unknown User"}
                </p>
                <p className="text-gray-700">
                    <strong>Email:</strong> {email || "No email found"}
                </p>
            </div>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
            >
                {/* Age */}
                <div>
                    <input
                        type="number"
                        placeholder="Age"
                        {...register("age", { valueAsNumber: true })}
                        className="w-full border rounded-md p-2"
                    />
                    {errors.age && (
                        <p className="text-red-500 text-sm">
                            {errors.age.message}
                        </p>
                    )}
                </div>

                {/* Address */}
                <div>
                    <input
                        type="text"
                        placeholder="Address"
                        {...register("address")}
                        className="w-full border rounded-md p-2"
                    />
                    {errors.address && (
                        <p className="text-red-500 text-sm">
                            {errors.address.message}
                        </p>
                    )}
                </div>
                <div>
                    <label className="font-semibold text-gray-700">
                        Select Place you want to be a Guide for
                    </label>
                    <select
                        {...register("place_id")}
                        defaultValue=""
                        className="w-full border rounded-md p-2 bg-white"
                    >
                        <option value="" disabled>
                            -- Choose a place --
                        </option>
                        {places.map((place) => (
                            <option key={place.place_id} value={place.place_id}>
                                {place.name}
                            </option>
                        ))}
                    </select>
                    {errors.place_id && (
                        <p className="text-red-500 text-sm">
                            {errors.place_id.message}
                        </p>
                    )}
                </div>
                {/* Contact */}
                <div>
                    <input
                        type="tel"
                        placeholder="Contact Number"
                        {...register("contact")}
                        className="w-full border rounded-md p-2"
                    />
                    {errors.contact && (
                        <p className="text-red-500 text-sm">
                            {errors.contact.message}
                        </p>
                    )}
                </div>

                {/* Image Uploads */}
                <div>
                    <label className="font-semibold text-gray-700">
                        Upload ID Image 1
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        {...register("id_image1")}
                        className="w-full border rounded-md p-2"
                    />
                    {errors.id_image1?.message && (
                        <p className="text-red-500 text-sm">
                            {String(errors.id_image1.message)}
                        </p>
                    )}
                </div>

                <div>
                    <label className="font-semibold text-gray-700">
                        Upload ID Image 2
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        {...register("id_image2")}
                        className="w-full border rounded-md p-2"
                    />
                    {errors.id_image2?.message && (
                        <p className="text-red-500 text-sm">
                            {String(errors.id_image2.message)}
                        </p>
                    )}
                </div>

                {errorMsg && (
                    <p className="text-center text-red-500 font-medium">
                        {errorMsg}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
                >
                    {loading ? "Submitting..." : "Submit"}
                </button>
            </form>
        </div>
    )
}
