import { FiUsers } from "react-icons/fi"
import { FaMapMarkedAlt } from "react-icons/fa"
import Link from "next/link"
import { Button } from "@components/ui/button"
import Image from "next/image"

const AdminPanel = () => {
    return (
        <div className="flex h-screen ">
            {/* Sidebar */}

            {/* Main Content */}
            <div className="flex-1 p-6 overflow-y-auto flex justify-center">
                <div className="w-full">
                    <div className="cont  my-10  border-b-2 border-gray-100">
                        <h2 className="text-4xl font-semibold text-accent mb-2 text-left">
                            Admin Dashboard
                        </h2>
                        <p className="text-gray-500 text-left text-base mb-8">
                            Manage places and local guides in Explore Pokhara.
                        </p>
                    </div>

                    {/* Cards Section */}
                    <div className="flex flex-row  gap-8  ">
                        <Link
                            href="/admin/place"
                            className="relative flex items-center cursor-pointer h-[250px] bg-white-100 border-2 border-gray-200 bg-gray-100  rounded-3xl p-6 max-w-md w-full overflow-hidden hover:shadow-xs group transition-shadow duration-300"
                        >
                            <div className="">
                                <div className="w-[60%]">
                                    <h2 className="mb-2 text-3xl font-bold text-gray-700">
                                        Add a Place
                                    </h2>
                                    <p className="text-gray-600 mb-6  text-lg  font-medium">
                                        Create and manage new locations in
                                        Pokhara.
                                    </p>
                                </div>

                                <div className="flex-shrink-0 absolute -right-20 -bottom-10 ">
                                    <Image
                                        src="/map.png"
                                        width={500}
                                        height={500}
                                        alt="Location illustration"
                                        className="w-[300px] h-[300px] object-contain group-hover:scale-120 transition-transform duration-400"
                                    />
                                </div>
                            </div>
                        </Link>
                        <Link
                            href="/admin/localguide"
                            className="relative flex items-center cursor-pointer h-[250px] bg-white-100 border-2 border-gray-200 bg-gray-100  rounded-3xl p-6 max-w-md w-full overflow-hidden group hover:shadow-xs transition-shadow duration-300"
                        >
                            <div className="">
                                <div className="w-[80%]">
                                    <h2 className="mb-2 text-3xl font-bold text-gray-700">
                                        Manage Guides
                                    </h2>
                                    <p className="text-gray-600 text-lg  font-medium mb-6 w-[90%]">
                                        Create and manage local guides in
                                        Pokhara.
                                    </p>
                                </div>

                                <div className="flex-shrink-0 absolute -right-20 -bottom-10 ">
                                    <Image
                                        src="/guide.png"
                                        width={300}
                                        height={300}
                                        alt="Location illustration"
                                        className="w-[300px] h-[300px] object-contain  group-hover:scale-110 transition-transform duration-400"
                                    />
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminPanel
