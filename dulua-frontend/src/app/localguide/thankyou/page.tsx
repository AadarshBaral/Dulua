import { ArrowLeft } from "lucide-react"
import Link from "next/link"

function ThankYou() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] ">
            {/* Thank You Section */}
            <div className="text-center flex flex-col items-center justify-center">
                <h1 className="text-[#1F4037] font-bold text-5xl mb-4">
                    Thank You
                </h1>
                <h2 className="text-xl font-semibold text-[#585858] mb-4">
                    Your application is being processed
                </h2>
                <p className="text-[#585858] mb-6">
                    We will notify you when your application gets approved.
                </p>

                {/* Back to Home Button */}
                <Link
                    href="/"
                    className="flex items-center gap-x-2 bg-[#1F4037] text-white w-[180px] h-[40px] rounded-[8px] px-[20px] py-[8px] text-[14px] cursor-pointer"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Home
                </Link>
            </div>
        </div>
    )
}

export default ThankYou
