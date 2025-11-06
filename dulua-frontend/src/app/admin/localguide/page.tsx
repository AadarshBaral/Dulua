"use client"

import { Button } from "@components/ui/button"
import { useEffect, useState } from "react"
import { FiUserCheck } from "react-icons/fi"

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
    verified: boolean
}

export default function LocalGuidesPage() {
    const [guides, setGuides] = useState<LocalGuide[]>([])
    const [selectedGuide, setSelectedGuide] = useState<LocalGuide | null>(null)
    const [loading, setLoading] = useState(true)
    const [approving, setApproving] = useState(false)

    // ✅ Fetch all guides on page load
    const fetchGuides = async () => {
        try {
            setLoading(true)
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/local_guide/getAllLocalGuides`,
                {
                    headers: {
                        Authorization: `bearer ${localStorage.getItem("token") || ""}`,
                    },
                }
            )
            const data = await res.json()
            setGuides(data)
        } catch (err) {
            console.error("Failed to fetch local guides:", err)
        } finally {
            setLoading(false)
        }
    }

    // ✅ Approve guide
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
            fetchGuides() // refresh list
        } catch (error) {
            console.error(error)
            alert("Error verifying guide")
        } finally {
            setApproving(false)
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
        <main className="p-8 max-w-[1280px] mx-auto">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
                Local Guide Applications
            </h1>

            {/* Table */}
            <div className="overflow-x-auto bg-white shadow-md rounded-xl border border-gray-100">
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
                                    {guide.verified ? (
                                        <span className="text-green-600 font-semibold">
                                            Verified
                                        </span>
                                    ) : (
                                        <span className="text-yellow-500 font-semibold">
                                            Pending
                                        </span>
                                    )}
                                </td>
                                <td className="px-4 py-3">
                                    <Button
                                        variant="outline"
                                        onClick={() => setSelectedGuide(guide)}
                                        className="text-sm flex items-center gap-1"
                                    >
                                        <FiUserCheck /> View
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ✅ Modal */}
            {selectedGuide && (
                <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
                    <div className="bg-white rounded-xl shadow-lg p-6 w-[400px] relative">
                        <button
                            onClick={() => setSelectedGuide(null)}
                            className="absolute top-2 right-3 text-gray-400 hover:text-gray-600 text-xl"
                        >
                            ×
                        </button>
                        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                            {selectedGuide.name}
                        </h2>

                        <div className="space-y-2 text-sm text-gray-700">
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
                            <p>
                                <strong>Bio:</strong> {selectedGuide.bio}
                            </p>
                            <p>
                                <strong>Status:</strong>{" "}
                                {selectedGuide.verified ? (
                                    <span className="text-green-600">
                                        Verified
                                    </span>
                                ) : (
                                    <span className="text-yellow-500">
                                        Pending
                                    </span>
                                )}
                            </p>
                        </div>

                        <div className="mt-6 flex justify-end gap-2">
                            {!selectedGuide.verified && (
                                <button
                                    onClick={() =>
                                        handleApprove(selectedGuide.user_id)
                                    }
                                    disabled={approving}
                                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
                                >
                                    {approving ? "Approving..." : "Approve"}
                                </button>
                            )}
                            <button
                                onClick={() => setSelectedGuide(null)}
                                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    )
}
