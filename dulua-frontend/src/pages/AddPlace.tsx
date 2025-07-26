"use client"

import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

type City = {
    city_id: string
    name: string
}

delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
})

export default function AddPlace() {
    const [cities, setCities] = useState<City[]>([])
    const [formData, setFormData] = useState({
        name: "",
        latitude: "",
        longitude: "",
        description: "",
        city_id: "",
        category: [] as string[],
        featured: false,
    })

    const [featuredMain, setFeaturedMain] = useState<File | null>(null)
    const [featuredSecondary, setFeaturedSecondary] = useState<File | null>(
        null
    )

    useEffect(() => {
        fetch("http://localhost:8000/city/all_cities")
            .then((res) => res.json())
            .then((data) => setCities(Array.isArray(data) ? data : [data]))
            .catch((err) => console.error("Failed to load cities", err))
    }, [])

    const handleChange = (e: any) => {
        const { name, value, type, checked } = e.target
        if (name === "category") {
            const updated = [...formData.category]
            checked
                ? updated.push(value)
                : updated.splice(updated.indexOf(value), 1)
            setFormData({ ...formData, category: updated })
        } else if (type === "checkbox") {
            setFormData({ ...formData, [name]: checked })
        } else {
            setFormData({ ...formData, [name]: value })
        }
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        const data = new FormData()
        Object.entries(formData).forEach(([key, value]) => {
            if (Array.isArray(value)) value.forEach((v) => data.append(key, v))
            else data.append(key, value.toString())
        })
        if (featuredMain) data.append("featured_image_main", featuredMain)
        if (featuredSecondary)
            data.append("featured_image_secondary", featuredSecondary)

        try {
            const res = await fetch("http://localhost:8000/city/add_place", {
                method: "POST",
                body: data,
            })
            const result = await res.json()
            alert(result.message)
        } catch (err) {
            console.error(err)
            alert("Failed to submit.")
        }
    }

    return (
        <div className="max-w-3xl mx-auto mt-10 px-4">
            <h1 className="text-3xl font-bold mb-6 text-center">
                📍 Add New Place
            </h1>

            <form
                onSubmit={handleSubmit}
                className="space-y-6"
                encType="multipart/form-data"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        className="input"
                        name="name"
                        placeholder="Place name"
                        onChange={handleChange}
                        required
                    />
                    <select
                        name="city_id"
                        onChange={handleChange}
                        required
                        className="input"
                        value={formData.city_id}
                    >
                        <option value="">Select a city</option>
                        {cities.map((city) => (
                            <option key={city.city_id} value={city.city_id}>
                                {city.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* 🗺️ Map below city and name */}
                <div className="mb-6">
                    <h2 className="text-lg font-semibold mb-2">
                        Choose location on map
                    </h2>
                    <MapContainer
                        center={[28.2096, 83.9856]} // Pokhara
                        zoom={13}
                        style={{ height: "300px", width: "100%" }}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
                        />
                        <MapClickHandler setFormData={setFormData} />
                        {formData.latitude && formData.longitude && (
                            <Marker
                                position={[
                                    parseFloat(formData.latitude),
                                    parseFloat(formData.longitude),
                                ]}
                            />
                        )}
                    </MapContainer>
                </div>

                {/* Hidden lat/lng fields */}
                <input
                    type="hidden"
                    name="latitude"
                    value={formData.latitude}
                />
                <input
                    type="hidden"
                    name="longitude"
                    value={formData.longitude}
                />

                <textarea
                    name="description"
                    placeholder="Description"
                    className="input h-24"
                    onChange={handleChange}
                    required
                />

                <fieldset className="border p-4 rounded">
                    <legend className="text-sm font-semibold text-gray-700">
                        Select Categories
                    </legend>
                    <div className="flex flex-wrap gap-3 mt-2">
                        {[
                            "must_visit",
                            "adventure",
                            "culture",
                            "nature",
                            "food",
                            "history",
                            "panaroma",
                        ].map((cat) => (
                            <label
                                key={cat}
                                className="flex items-center space-x-2"
                            >
                                <input
                                    type="checkbox"
                                    name="category"
                                    value={cat}
                                    onChange={handleChange}
                                    className="checkbox"
                                />
                                <span className="text-sm">{cat}</span>
                            </label>
                        ))}
                    </div>
                </fieldset>

                <label className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        name="featured"
                        onChange={handleChange}
                        className="checkbox"
                    />
                    <span>Mark as featured</span>
                </label>

                <div className="space-y-2">
                    <label className="block">
                        <span className="text-sm font-medium">
                            Featured Image (Main)
                        </span>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                                setFeaturedMain(e.target.files?.[0] || null)
                            }
                            required
                            className="input"
                        />
                    </label>

                    <label className="block">
                        <span className="text-sm font-medium">
                            Featured Image (Secondary)
                        </span>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                                setFeaturedSecondary(
                                    e.target.files?.[0] || null
                                )
                            }
                            className="input"
                        />
                    </label>
                </div>

                <button
                    type="submit"
                    className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Submit
                </button>
            </form>

            <style jsx>{`
                .input {
                    width: 100%;
                    padding: 0.5rem;
                    border: 1px solid #d1d5db;
                    border-radius: 0.375rem;
                    font-size: 1rem;
                }
                .checkbox {
                    width: 1rem;
                    height: 1rem;
                }
            `}</style>
        </div>
    )
}

function MapClickHandler({ setFormData }: { setFormData: Function }) {
    useMapEvents({
        click(e) {
            setFormData((prev: any) => ({
                ...prev,
                latitude: e.latlng.lat.toFixed(6),
                longitude: e.latlng.lng.toFixed(6),
            }))
        },
    })
    return null
}
                                                                                                                                                                                                                                                                          