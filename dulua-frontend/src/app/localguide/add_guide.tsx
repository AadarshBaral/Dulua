"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { IPlace } from "@api/core"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useSelector } from "react-redux"
import { redirect } from "next/navigation"

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
    contact: z.string().min(7, "Contact number must be at least 7 digits"),
    place_id: z.string().uuid("Please select a valid place"),
})

type LocalGuideFormData = z.infer<typeof localGuideSchema>

export default function LocalGuideForm({ places }: { places: IPlace[] }) {
    const [step, setStep] = useState(1)
    const [selectedLanguages, setSelectedLanguages] = useState<string[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const [formData, setFormData] = useState<LocalGuideFormData>({
        age: 0,
        address: "",
        contact: "",
        place_id: "",
        id_image1: undefined,
        id_image2: undefined,
    })
    const [errorMsg, setErrorMsg] = useState<string | null>(null)

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        trigger,
        reset,
    } = useForm<LocalGuideFormData>({
        resolver: zodResolver(localGuideSchema),
    })

    const handleNextStep = async () => {
        let fieldsToValidate: (keyof LocalGuideFormData)[] = []

        if (step === 1) fieldsToValidate = ["age", "address", "contact"]
        if (step === 2) fieldsToValidate = ["place_id"]
        if (step === 3) fieldsToValidate = ["id_image1", "id_image2"]

        const isValid = await trigger(fieldsToValidate)
        if (step === 2 && selectedLanguages.length === 0) {
            setLanguageError("Please add at least one language.")
            return
        } else {
            setLanguageError(null)
        }
        if (isValid) {
            setStep(step + 1)
        } else {
            console.log("Validation failed on step", step)
        }
        trigger(fieldsToValidate, { shouldFocus: true })
    }

    const handlePrevStep = () => setStep(step - 1)

    const handleLanguageInputChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const value = e.target.value
        setSearchTerm(value)
        if (value.includes(",")) {
            const language = value.split(",")[0].trim()
            if (language && !selectedLanguages.includes(language)) {
                setSelectedLanguages([...selectedLanguages, language])
            }
            setSearchTerm("") // Reset the input field
        }
    }

    const handleLanguageRemove = (lang: string) => {
        setSelectedLanguages(selectedLanguages.filter((l) => l !== lang))
    }
    const [languageError, setLanguageError] = useState<string | null>(null)

    const { username, email } =
        useSelector((state: any) => state.auth.user) || {}
    const onSubmit = async (data: LocalGuideFormData) => {
        setErrorMsg(null)

        const formData = new FormData()
        formData.append("id_image1", data.id_image1[0])
        formData.append("id_image2", data.id_image2[0])
        formData.append("name", username) // Replace with real name (from Redux)
        formData.append("age", String(data.age))
        formData.append("address", data.address)
        formData.append("contact", data.contact)
        formData.append("email", email) // Replace with real email (from Redux)
        formData.append("place_id", data.place_id)
        formData.append("languages", JSON.stringify(selectedLanguages))

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
                redirect("/localguide/thankyou")
            } else {
                const result = await res.json()
                console.log("Error adding local guide:", result)
                setErrorMsg(result.detail || "Something went wrong")
            }
        } catch (error) {
            setErrorMsg("Network error or server unreachable")
        }
    }

    return (
        <div className="mx-auto bg-white rounded-2xl p-6 mt-6 w-[60vh]">
            {/* Progress Bar */}
            <div className="cont flex flex-col gap-4">
                <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div
                        className={`h-full bg-accent rounded-full`}
                        style={{
                            width: `${(step / 3) * 100}%`,
                        }}
                    />
                </div>
                <h2 className="text-2xl font-bold text-left text-gray-700 mb-10">
                    Step {step} - Enter your details
                </h2>
            </div>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
            >
                {/* Step 1 - Age, Address, Contact */}
                {step === 1 && (
                    <div className="cont flex gap-4 flex-col h-[300px]">
                        <div className="flex flex-col gap-4">
                            {/* Age */}
                            <div>
                                <label className="font-semibold text-gray-600">
                                    Age
                                </label>
                                <input
                                    type="number"
                                    placeholder="Age"
                                    {...register("age", {
                                        valueAsNumber: true,
                                    })}
                                    className="w-full border rounded-md py-4 px-3"
                                />
                                {errors.age && (
                                    <p className="text-red-500 text-sm">
                                        {errors.age.message}
                                    </p>
                                )}
                            </div>

                            {/* Address */}
                            <div>
                                <label className="font-semibold text-gray-600">
                                    Address
                                </label>
                                <input
                                    type="text"
                                    placeholder="Address"
                                    {...register("address")}
                                    className="w-full border rounded-md py-4 px-3"
                                />
                                {errors.address && (
                                    <p className="text-red-500 text-sm">
                                        {errors.address.message}
                                    </p>
                                )}
                            </div>

                            {/* Contact */}
                            <div>
                                <label className="font-semibold text-gray-600">
                                    Contact Number
                                </label>
                                <input
                                    type="tel"
                                    placeholder="Contact Number"
                                    {...register("contact")}
                                    className="w-full border rounded-md py-4 px-3"
                                />
                                {errors.contact && (
                                    <p className="text-red-500 text-sm">
                                        {errors.contact.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Navigation Buttons */}
                        <div className="cont flex justify-end">
                            <button
                                type="button"
                                onClick={handleNextStep}
                                className="bg-primary text-white py-2 rounded-full hover:bg-primary/90 transition px-4 flex items-center justify-center cursor-pointer"
                            >
                                Next Step <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 2 - Languages */}
                {step === 2 && (
                    <div>
                        <label className="font-semibold text-gray-600 mb-2">
                            Languages Spoken (Comma separated)
                        </label>

                        <div className="w-full flex flex-col h-[300px] gap-4">
                            <div className="flex flex-wrap gap-2 items-center h-10 py-2">
                                Languages:
                                {selectedLanguages.map((lang) => (
                                    <span
                                        key={lang}
                                        className="flex items-center justify-between rounded-full bg-[#DEDEDE] px-3 py-1 h-[26px] text-sm text-gray-800"
                                    >
                                        {lang}
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleLanguageRemove(lang)
                                            }
                                            className="ml-2 text-gray-500 hover:text-gray-700"
                                        >
                                            &times;
                                        </button>
                                    </span>
                                ))}
                            </div>

                            <input
                                type="text"
                                value={searchTerm}
                                onChange={handleLanguageInputChange}
                                placeholder="Type a language and press comma to add"
                                className="w-full p-2 rounded-md mb-2 border-2 py-4 px-3"
                            />
                            {languageError && (
                                <p className="text-red-500 text-sm mt-1">
                                    {languageError}
                                </p>
                            )}
                            {/* Place Dropdown */}
                            <div>
                                <label className="font-semibold text-gray-700">
                                    Select Place you want to be a Guide for
                                </label>
                                <select
                                    {...register("place_id")}
                                    defaultValue=""
                                    className="w-full border rounded-md py-4 px-3"
                                >
                                    <option value="" disabled>
                                        -- Choose a place --
                                    </option>
                                    {places.map((place) => (
                                        <option
                                            key={place.place_id}
                                            value={place.place_id}
                                        >
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
                        </div>

                        {/* Navigation Buttons */}
                        <div className="cont flex justify-between">
                            <button
                                type="button"
                                onClick={handlePrevStep}
                                className="cursor-pointer"
                            >
                                <ChevronLeft />
                            </button>

                            <button
                                type="button"
                                onClick={handleNextStep}
                                className="bg-primary text-white py-2 rounded-full hover:bg-primary/90 transition px-4 flex items-center justify-center cursor-pointer"
                            >
                                Next Step <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 3 - Upload Images */}
                {step === 3 && (
                    <div>
                        {/* ID Image 1 */}
                        <div className="cont h-[300px] flex flex-col gap-4">
                            <div>
                                <label className="font-semibold text-gray-700">
                                    Upload ID Image 1
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    {...register("id_image1")}
                                    className="w-full border rounded-md py-4 px-3"
                                />
                                {errors.id_image1?.message && (
                                    <p className="text-red-500 text-sm">
                                        {String(errors.id_image1.message)}
                                    </p>
                                )}
                            </div>

                            {/* ID Image 2 */}
                            <div>
                                <label className="font-semibold text-gray-700">
                                    Upload ID Image 2
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    {...register("id_image2")}
                                    className="w-full border rounded-md p-2 py-4 px-3"
                                />
                                {errors.id_image2?.message && (
                                    <p className="text-red-500 text-sm">
                                        {String(errors.id_image2.message)}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Navigation Buttons */}
                        <div className="cont flex justify-between">
                            <button
                                type="button"
                                onClick={handlePrevStep}
                                className="cursor-pointer"
                            >
                                <ChevronLeft />
                            </button>

                            <button
                                type="submit"
                                className="bg-primary text-white py-2 rounded-full hover:bg-primary/90 transition px-4 flex items-center justify-center cursor-pointer"
                            >
                                Submit Form <ChevronRight />
                            </button>
                        </div>
                    </div>
                )}
            </form>
        </div>
    )
}
