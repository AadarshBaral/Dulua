import { Icon } from "@iconify/react/dist/iconify.js";

function ThankYou(){
return(
    <div>
      <div className="flex lg:w-[1080px] w-[458px] h-[27px] lg:pl-[180px] ml-[21px] pt-[32px] justify-between">
            <div className=" lg:flex lg:space-x-2 lg:items-center flex items-center">
                <p className="w-[26px] h-[26px] rounded-[8px] bg-[#1F4037]"></p>
                <h1 className="font-bold text-[20px]">Dulua</h1>
            </div>
            <div className="flex space-x-2 absolute right-6 -translate-y-2 lg:-translate-y-4 lg:-translate-x-67">
                <p className="font-semibold text-[16px] ">Alex Manroe</p>
                <Icon icon='iconamoon:profile-circle-light' className="h-[24px] w-[24px]"/>
            </div>
        </div>
        {/* THank you msg */}
        <div className="relative -translate-x-27 lg:translate-x-62 lg:-translate-y-10">

       
        <div className="w-[661px] h-[224px] mt-[276px] ml-[390px] gap-[16px] flex flex-col">
<h1 className="text-[#1F4037] font-bold text-[48px]">Thankyou</h1>
    </div>
<h1 className="text-[24px] font-semibold relative translate-x-80 -translate-y-35">Your application Is being processed</h1>
<h1 className="font-semibold text-[16px] text-[#585858] relative translate-x-75 -translate-y-34">We will notify you when your application gets approved.</h1>


<div className="relative translate-x-110 -translate-y-20">
  <button className="flex items-center gap-x-2 bg-[#1F4037] text-white w-[151px] h-[33px] rounded-[8px] px-[20px] py-[6px] text-[14px] cursor-pointer">
    <Icon icon="basil:arrow-left-solid" width="16" height="16" />
    Back to Home
  </button>
</div>
 </div>
</div>
      

)
}
export default ThankYou;