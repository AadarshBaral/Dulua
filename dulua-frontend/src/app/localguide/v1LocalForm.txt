import { Icon } from "@iconify/react/dist/iconify.js";
import { useState } from "react";
function Form(){
      const [selectedLanguages, setSelectedLanguages] = useState(["English", "Nepali"]);

      const [showDropdown, setShowDropdown] = useState(false);
    
      const allLanguages = ["English", "Nepali", "Hindi", "Spanish", "French", "German"];
    
      // Remove language
      const handleRemove = (lang) => {
        setSelectedLanguages(selectedLanguages.filter((l) => l !== lang));
      };
    
      // Add language
      const handleSelect = (lang) => {
        if (!selectedLanguages.includes(lang)) {
          setSelectedLanguages([...selectedLanguages, lang]);
        }
        setShowDropdown(false);
      };
    
return(
    <div>
        <div className="flex w-[1080px] h-[27px] pl-[180px] pt-[32px] justify-between">
            <div className="flex space-x-2 items-center">
                <p className="w-[26px] h-[26px] rounded-[8px] bg-[#1F4037]"></p>
                <h1 className="font-bold text-[20px]">Dulua</h1>
            </div>
            <div className="flex space-x-2 items-center">
                <p className="font-semibold text-[16px] text-[quicksand]">Alex Manroe</p>
                <Icon icon='iconamoon:profile-circle-light' className="h-[24px] w-[24px]"/>

            </div>
        </div>
        <div className="flex mt-[141px] ml-[180px] ">
            <div>
            <img src="src\Guide.png" alt="" className="w-[554px] h-[554px] rounded-[28px] object-cover"/>
            </div>
            <div className="rounded-[16px] border-[1px] border-[#E1E1E1] drop-shadow-[0px_5px_11.1px_#00000014]  pl-[28px] pr-[28px] pb-[20px] pt-[20px] ml-[22px] w-[435px] h-[766px]">
<h1 className="text-[#1F4037] font-semibold text-[24px] text-center">Register as Guide</h1>
{/* form starts here */}
<div >
    <div className="mt-[20px]">
    <label>Full Name</label>
    <input type="text" className="mt-[5px] w-[379px] h-[40px] rounded-[8px] border-[1px] pr-[10px] pl-[10px] border-[#E1E1E1] placeholder:font-semibold placeholder:text-[14px] placeholder:text-[#B9B9B9]" placeholder="Enter Full Name"/>
    </div>
    <div className="mt-[20px]">
    <label>Address</label>
    <input type="text" className="mt-[5px] w-[379px] h-[40px] rounded-[8px] border-[1px] pr-[10px] pl-[10px] border-[#E1E1E1] placeholder:font-semibold placeholder:text-[14px] placeholder:text-[#B9B9B9]" placeholder="Enter Address Here"/>
    </div>
    <div className="mt-[20px]">
    <label>Email</label>
    <input type="text" className="mt-[5px] w-[379px] h-[40px] rounded-[8px] border-[1px] pr-[10px] pl-[10px] border-[#E1E1E1] placeholder:font-semibold placeholder:text-[14px] placeholder:text-[#B9B9B9]" placeholder="Enter Email Here"/>
    </div>
    <div className="flex space-x-2">
    <div className="mt-[20px]">
    <label className="pl-[5px]">Age</label>
    <input type="text" className="mt-[5px] w-[80px] h-[40px] rounded-[8px] border-[1px] pr-[10px] pl-[10px] border-[#E1E1E1] placeholder:font-semibold placeholder:text-[14px] placeholder:text-[#B9B9B9]" placeholder="Age"/>
    </div>
    <div className="mt-[20px]">
    <label>Phone Number</label>
    <input type="text" className="mt-[5px] w-[290px] h-[40px] rounded-[8px] border-[1px] pr-[10px] pl-[10px] border-[#E1E1E1] placeholder:font-semibold placeholder:text-[14px] placeholder:text-[#B9B9B9]" placeholder="Enter Phone Number Here"/>
    </div>

    </div>
    {/* Main */}
<label className="mt-[20px]">Language Spoken</label>
  <div className=" mt-[20px] w-[379px] h-[40px] rounded-[8px] border-[1px] border-[#E1E1E1] mt-[5px] pr-[10px] pl-[10px]">
<div className="flex space-x-2 mt-[5px]">
    <span className="w-[96.07px] h-[26px] rounded-[4px] p-[8px] bg-[#DEDEDE] text-center">English</span>
    <span className="w-[96.07px] h-[26px] rounded-[4px] p-[8px] bg-[#DEDEDE]">English</span>

</div>

<select className="">
    
    <option value="" selected>English</option>
    <option value="" selected>Nepali</option>
    <option value="">Spanish</option>
</select>
  </div>

</div>
            </div>
        </div>
        <div className="relative w-[379px] rounded-[8px] border border-[#E1E1E1] mt-[5px] px-[10px] py-[5px]">
      <div className="flex flex-wrap items-center gap-2">
        {selectedLanguages.map((lang) => (
          <span
            key={lang}
            className="flex items-center justify-between rounded-[4px] bg-[#DEDEDE] px-[7px] h-[26px]"
          >
            <span className="text-sm text-gray-800">{lang}</span>
            <button
              onClick={() => handleRemove(lang)}
              className="ml-2 text-gray-500 hover:text-gray-700 text-base"
            >
              &times;
            </button>
          </span>
        ))}

        {/* Divider and Dropdown Trigger */}
        <div className="flex items-center ml-auto gap-2 cursor-pointer" onClick={() => setShowDropdown(!showDropdown)}>
          <p className="text-[#E1E1E1]">|</p>
          <Icon icon="lucide:chevron-down" className="text-2xl text-[#686868]" />
        </div>
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow-md max-h-40 overflow-y-auto">
          {allLanguages
            .filter((lang) => !selectedLanguages.includes(lang))
            .map((lang) => (
              <div
                key={lang}
                onClick={() => handleSelect(lang)}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-700"
              >
                {lang}
              </div>
            ))}
        </div>
      )}
    </div>
    </div>
)
}
export default Form;