export default function ThankYouPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-6">
            <div className="bg-white shadow-lg rounded-xl p-8 text-center max-w-md">
                <h1 className="text-3xl font-bold text-green-600 mb-4">
                    Thank You!
                </h1>
                <p className="text-gray-700 mb-3">
                    Your Local Guide application has been submitted
                    successfully.
                </p>
                <p className="text-gray-600">
                    Our admin team will review your information and approve your
                    profile shortly.
                </p>
            </div>
        </div>
    )
}
