"use client"

const PersonalInformationForm = () => {
    return (
        <form className="mt-[50px] p-[32px] gap-[43px] rounded-[32px] md:ml-[70px] lg:ml-[260px]">
            <h1 className="text-[24px] mb-[10px]">Personal Information</h1>

            <div className="flex flex-col mt-[30px]">
                <label className="text-neutral-400">Name</label>
                <input
                    type="text"
                    className="border-[1px] border-neutral-300 rounded-[8px] w-[370px] h-[40px] pr-[10px] pl-[10px]"
                />
            </div>

            <div className="mt-[30px] flex flex-col">
                <label className="text-neutral-400">Country</label>
                <select className="border border-neutral-300 rounded-[8px] w-[370px] h-[40px] pr-[10px] pl-[10px]">
                    <option>USA</option>
                    <option>Nepal</option>
                    <option>Australia</option>
                    <option>India</option>
                </select>
            </div>

            <div className="mt-[30px] flex flex-col">
                <label className="text-neutral-400">Email</label>
                <input
                    type="email"
                    className="border-[1px] border-neutral-300 rounded-[8px] w-[370px] h-[40px] pr-[10px] pl-[10px]"
                />
            </div>

            <div className="flex space-x-[10px] mt-[35px]">
                <button
                    type="button"
                    className="rounded-[8px] pr-[20px] pb-[8px] pl-[20px] w-[177px] h-[33px] border-[1px] border-neutral-500 pt-[3px] cursor-pointer hover:underline"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="bg-green-950 text-white rounded-[8px] pr-[20px] pb-[8px] pl-[20px] w-[177px] h-[33px] border-[1px] border-neutral-500 pt-[3px] cursor-pointer hover:bg-green-800"
                >
                    Save Changes
                </button>
            </div>
        </form>
    )
}

export default PersonalInformationForm
