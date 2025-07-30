"use client"
import SliderComponent from "@components/ui/SliderComponent"
import { useAppSelector } from "@lib/hooks"
import React from "react"
import { FaLeaf } from "react-icons/fa6"
import { RootState } from "store/store"
import { useState } from "react";

const page = () => {
    const user = useAppSelector((state: RootState) => state.auth.user)
    const[activeTab,setActiveTab]=useState('favorite')
    return (
 <div className="relative">
      {/* Background image */}
      <div className="w-full h-[246px] ">
        <img
          src="/default.png"
          alt="sorry"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Main Card */}
      <div className="absolute w-[500px] md:w-[600px] lg:w-[1080px] h-[230px] top-[158px] left-0 flex flex-col border-[1px] rounded-[32px] lg:left-0 bg-white/85">
        <div className="flex flex-col mx-4 my-4">
          {/* Top Section */}
          <div className="flex space-x-4">
            <img
              className="w-[140px] h-[140px] rounded-full"
              src="/default.png"
              alt=""
            />
            <div className="flex flex-col">
              <h1 className="text-[24px]">Alex Manroe</h1>
              <p className="text-[14px] font-light">@alex2139</p>
              <div className="mt-[11px] flex space-x-4">
                <div>
                  <h3 className="text-[14px]">Contribution</h3>
                  <p className="text-[32px]">28</p>
                </div>
                <div>
                  <h3 className="text-[14px]">Green Points</h3>
                  <div className="flex items-center space-x-1">
                    <p className="text-[32px]">500</p>
                    <FaLeaf

                    
                      className="text-green-600"

                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-[39px] mt-[30px]">
           <button 
           onClick={()=>setActiveTab('favorite')}
           className={`${activeTab==='favorite'?"font-semibold border-b-2 border-green-800 text-green-600 ":"text-neutral-500"}`}
           >Favorite</button>
           <button onClick={()=>setActiveTab("personal information")}
            className={`${activeTab==="personal information"?"font-semibold border-b-2 border-green-800 text-green-600 ":"text-neutral-500"}`}
            >
Personal Information
           </button>
          </div>
          {activeTab==="favorite"&&(
         <SliderComponent/>
          )}
          {activeTab==="personal information"&&(
              <form className="mt-[50px] p-[32px] gap-[43px] rounded-[32px] md:ml-[70px] lg:ml-[260px]">
            <h1 className="text-[24px] mb-[10px]">Personal Information</h1>
            <div className="flex flex-col mt-[30px]">
                <label className="text-neutral-400">Name</label>
                <input type="text" className="border-[1px] border-neutral-300 rounded-[8px] w-[370px] h-[40px] pr-[10px] pl-[10px]" />
            </div>
            <div className="mt-[30px] flex flex-col">
            <label className="text-neutral-400">Country</label>
            <select className="border border-neutral-300 rounded-[8px] w-[370px] h-[40px] pr-[10px] pl-[10px]">
                <option>Usa</option>
                <option>Nepal</option>
                <option>Australia</option>
                <option>India</option>
            </select>
            </div>
            <div className="mt-[30px] flex flex-col">
                <label className="text-neutral-400">Email</label>
                <input type="email" className="border-[1px] border-neutral-300 rounded-[8px] w-[370px] h-[40px] pr-[10px] pl-[10px]"/>
            </div>
            <div className="flex space-x-[10px] mt-[35px]">
                <button className="rounded-[8px] pr-[20px] pb-[8px] pl-[20px] w-[177px] h-[33px] border-[1px] border-neutral-500 pt-[3px] cursor-pointer hover:underline">Cancel</button>
                <button className="bg-green-950 text-white rounded-[8px] pr-[20px] pb-[8px] pl-[20px] w-[177px] h-[33px] border-[1px] border-neutral-500 pt-[3px] cursor-pointer hover:bg-green-800">Save Changes</button>
            </div>
            </form>
          )}

  
      
        </div>

    
   
      </div>
    </div>
    );
}

export default page
