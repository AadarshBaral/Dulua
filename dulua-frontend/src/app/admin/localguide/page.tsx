"use client"

import { Button } from "@components/ui/button"
import { useEffect, useState } from "react"
import { FiUserCheck } from "react-icons/fi"
import { FaTrash, FaBan } from "react-icons/fa"

interface LocalGuide {
    guide_id: string
    user_id: string
    name: string
    email: string
    contact: number
    age: number
    address: string
    bio: string
    language: string
    id_image1: string
    id_image2: string
    status: boolean
}

export default function LocalGuidesPage() {
    const [guides, setGuides] = useState<LocalGuide[]>([])
    const [selectedGuide, setSelectedGuide] = useState<LocalGuide | null>(null)
    const [loading, setLoading] = useState(true)
    const [approving, setApproving] = useState(false)
    const [disabling, setDisabling] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [previewImage, setPreviewImage] = useState<string | null>(null)

    // ✅ Fetch all guides on page load
    const fetchGuides = async () => {
        try {
            setLoading(true)
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/local_guide/getAllLocalGuidesAdmin`,
                {
                    headers: {
                        Authorization: `bearer ${localStorage.getItem("token") || ""}`,
                    },
                }
            )
            const data = await res.json()
            setGuides(Array.isArray(data) ? data : [])
        } catch (err) {
            console.error("Failed to fetch local guides:", err)
        } finally {
            setLoading(false)
        }
    }

    // 🟢 Approve guide
    const handleApprove = async (userId: string) => {
        setApproving(true)
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/local_guide/verifyLocalGuide/${userId}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `bearer ${localStorage.getItem("token") || ""}`,
                    },
                }
            )

            if (!res.ok) throw new Error("Failed to verify guide")
            alert("Guide verified successfully ✅")
            setSelectedGuide(null)
            fetchGuides()
        } catch (error) {
            console.error(error)
            alert("Error verifying guide")
        } finally {
            setApproving(false)
        }
    }

    // 🟡 Disable guide (soft deactivate)
    const handleDisable = async (guideId: string) => {
        if (!confirm("Are you sure you want to disable this guide?")) return

        setDisabling(true)
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/local_guide/disableLocalGuide/${guideId}`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `bearer ${localStorage.getItem("token") || ""}`,
                    },
                }
            )

            if (!res.ok) throw new Error("Failed to disable guide")
            alert("Guide disabled successfully 🚫")
            setSelectedGuide(null)
            fetchGuides()
        } catch (error) {
            console.error(error)
            alert("Error disabling guide")
        } finally {
            setDisabling(false)
        }
    }

    // 🔴 Delete guide (hard delete)
    const handleDelete = async (guideId: string) => {
        if (!confirm("This will permanently delete the guide. Continue?"))
            return

        setDeleting(true)
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/local_guide/deleteLocalGuide/${guideId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `bearer ${localStorage.getItem("token") || ""}`,
                    },
                }
            )

            if (!res.ok) throw new Error("Failed to delete guide")
            alert("Guide deleted permanently 🗑️")
            setSelectedGuide(null)
            fetchGuides()
        } catch (error) {
            console.error(error)
            alert("Error deleting guide")
        } finally {
            setDeleting(false)
        }
    }

    useEffect(() => {
        fetchGuides()
    }, [])

    if (loading)
        return (
            <div className="flex justify-center items-center h-screen text-lg font-medium text-gray-600">
                Loading guides...
            </div>
        )

    return (
        <main className="p-8 max-w-[1280px] h-[calc(100vh-4rem)] mx-auto">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
                Local Guide Applications
            </h1>

            {/* Table */}
            <div className="overflow-x-auto bg-white rounded-xl border border-gray-100">
                <table className="w-full border-collapse">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="text-left px-4 py-3 font-medium text-gray-600">
                                Name
                            </th>
                            <th className="text-left px-4 py-3 font-medium text-gray-600">
                                Email
                            </th>
                            <th className="text-left px-4 py-3 font-medium text-gray-600">
                                Contact
                            </th>
                            <th className="text-left px-4 py-3 font-medium text-gray-600">
                                Status
                            </th>
                            <th className="text-left px-4 py-3 font-medium text-gray-600">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {guides.map((guide) => (
                            <tr
                                key={guide.guide_id}
                                className="border-t hover:bg-gray-50 transition"
                            >
                                <td className="px-4 py-3">{guide.name}</td>
                                <td className="px-4 py-3">{guide.email}</td>
                                <td className="px-4 py-3">{guide.contact}</td>
                                <td className="px-4 py-3">
                                    {guide.status ? (
                                        <span className="text-green-600 font-semibold">
                                            Verified
                                        </span>
                                    ) : (
                                        <span className="text-gray-400 font-semibold">
                                            Disabled
                                        </span>
                                    )}
                                </td>
                                <td className="px-4 py-3 flex gap-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => setSelectedGuide(guide)}
                                        className="text-sm flex items-center gap-1"
                                    >
                                        <FiUserCheck /> View
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        onClick={() =>
                                            handleDelete(guide.guide_id)
                                        }
                                        className="text-sm flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white"
                                    >
                                        <FaTrash />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ✅ Modal */}
            {selectedGuide && (
                <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 px-4">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-3xl relative overflow-y-auto max-h-[90vh]">
                        {/* Close Button */}
                        <button
                            onClick={() => setSelectedGuide(null)}
                            className="absolute top-4 right-5 text-gray-400 hover:text-gray-600 text-2xl"
                        >
                            ×
                        </button>

                        {/* Header */}
                        <h2 className="text-3xl font-semibold mb-6 text-gray-800 border-b pb-3">
                            {selectedGuide.name}
                        </h2>

                        {/* Image Section */}
                        <div className="flex justify-center gap-6 mb-6">
                            {["id_image1", "id_image2"].map((key) => {
                                const imgUrl = `${process.env.NEXT_PUBLIC_API_URL}/${selectedGuide[key].replace(/\\/g, "/")}`
                                return (
                                    <img
                                        key={key}
                                        src={imgUrl}
                                        alt={key}
                                        onClick={() => setPreviewImage(imgUrl)} // 👈 open preview
                                        className="w-52 h-52 object-cover rounded-lg border cursor-pointer hover:scale-105 transition-transform duration-200"
                                    />
                                )
                            })}
                        </div>

                        {/* Info Section */}
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                            <p>
                                <strong>Email:</strong> {selectedGuide.email}
                            </p>
                            <p>
                                <strong>Contact:</strong>{" "}
                                {selectedGuide.contact}
                            </p>
                            <p>
                                <strong>Age:</strong> {selectedGuide.age}
                            </p>
                            <p>
                                <strong>Address:</strong>{" "}
                                {selectedGuide.address}
                            </p>
                            <p>
                                <strong>Language:</strong>{" "}
                                {selectedGuide.language}
                            </p>
                            <p className="col-span-2">
                                <strong>Bio:</strong> {selectedGuide.bio}
                            </p>
                            <p className="col-span-2">
                                <strong>Status:</strong>{" "}
                                {selectedGuide.status ? (
                                    <span className="text-green-600 font-medium">
                                        Verified
                                    </span>
                                ) : (
                                    <span className="text-gray-500 font-medium">
                                        Disabled
                                    </span>
                                )}
                            </p>
                        </div>

                        {/* Buttons */}
                        <div className="mt-8 flex justify-end gap-3 flex-wrap">
                            {!selectedGuide.status && (
                                <button
                                    onClick={() =>
                                        handleApprove(selectedGuide.user_id)
                                    }
                                    disabled={approving}
                                    className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-md text-sm font-medium"
                                >
                                    {approving ? "Approving..." : "Approve"}
                                </button>
                            )}
                            {selectedGuide.status && (
                                <button
                                    onClick={() =>
                                        handleDisable(selectedGuide.guide_id)
                                    }
                                    disabled={disabling}
                                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded-md text-sm font-medium flex items-center gap-1"
                                >
                                    <FaBan />
                                    {disabling ? "Disabling..." : "Disable"}
                                </button>
                            )}
                            <button
                                onClick={() =>
                                    handleDelete(selectedGuide.guide_id)
                                }
                                disabled={deleting}
                                className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-md text-sm font-medium flex items-center gap-1"
                            >
                                <FaTrash />
                                {deleting ? "Deleting..." : "Delete"}
                            </button>
                            <button
                                onClick={() => setSelectedGuide(null)}
                                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-5 py-2 rounded-md text-sm font-medium"
                            >
                                Close
                            </button>
                        </div>
                    </div>

                    {/* 👇 Full Image Preview Overlay */}
                    {previewImage && (
                        <div
                            className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60]"
                            onClick={() => setPreviewImage(null)}
                        >
                            <img
                                src={previewImage}
                                alt="Preview"
                                className="max-w-[90%] max-h-[90%] rounded-lg shadow-2xl border-4 border-white object-contain"
                            />
                            <button
                                onClick={() => setPreviewImage(null)}
                                className="absolute top-6 right-10 text-white text-3xl font-bold hover:text-gray-300"
                            >
                                ×
                            </button>
                        </div>
                    )}
                </div>
            )}
        </main>
    )
}
