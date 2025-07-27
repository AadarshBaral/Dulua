export default function LoadingPlaceDetail() {
    return (
        <div className="px-8 py-8 max-w-6xl mx-auto">
            <div className="animate-pulse space-y-4">
                <div className="h-6 bg-gray-300 rounded w-1/3" />
                <div className="h-[300px] bg-gray-200 rounded-xl" />
                <div className="h-4 bg-gray-300 rounded w-1/2 mt-4" />
                <div className="h-4 bg-gray-300 rounded w-3/4" />
                <div className="h-4 bg-gray-300 rounded w-2/5" />
            </div>
        </div>
    )
}
