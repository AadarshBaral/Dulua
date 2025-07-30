import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { BsChevronBarRight } from "react-icons/bs";
import { FaChevronRight } from "react-icons/fa6";

function SliderComponent() {
  const images = [
    {
      url: "/src/First.png",
      name: "Fewa Lake",
      place: "Lakeside",
      rating: "4.9",
    },
    {
      url: "/src/Second.png",
      name: "Sarangkot",
      place: "Pokhara",
      rating: "4.8",
    },
    {
      url: "/src/Third.png",
      name: "Devis Fall",
      place: "Pokhara",
      rating: "4.7",
    },
    {
      url: "/src/Fourth.png",
      name: "Ratna Park",
      place: "Pokhara",
      rating: "4.9",
    },
  ];
  const Foods = [
    {
      url: "/src/MOMO.png",
      name: "Momo",
      place: "Anyplace",
      rating: "4.9",
    },
    {
      url: "/src/Dal Bhat.png",
      name: "Dal Bhat",
      place: "Anyplace",
      rating: "4.8",
    },
    {
      url: "/src/MOMO.png",
      name: "Chowmein",
      place: "Anyplace",
      rating: "4.7",
    },
    {
      url: "/src/Dal Bhat.png",
      name: "Newari Thali",
      place: "Anyplace",
      rating: "4.9",
    },
  ];

 const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    speed: 2000,
    autoplaySpeed: 1500,
    cssEase: "linear"
  };


  return (
    <div className="absolute top-[298px] w-full px-4">
      {/* Add style tag for default arrows */}
      <style>
        {`
          .slick-prev:before,
          .slick-next:before {
            color: black; /* Arrow color */
            font-size: 24px; /* Arrow size */
            opacity: 1 !important; /* Ensure visibility */
          }
          .slick-prev {
            left: -30px; /* Adjust left arrow position */
          }
          .slick-next {
            right: -30px; /* Adjust right arrow position */
          }
          .slick-prev:hover:before,
          .slick-next:hover:before {
            color: #555; /* Hover color */
          }
        `}
      </style>

      <div className="flex items-center space-x-2 mb-4">
        <h1 className="text-[24px]">Places</h1>
        <FaChevronRight className="text-2xl"  />
      </div>

      <Slider {...settings}>
        {images.map((d, i) => (
          <div key={i} className="p-2 text-center">
            <div className="relative w-fit">
            <img
              className="md:w-[225px] md:h-[224px] h-[100px] w-[100px] rounded-[22px] object-cover mx-auto"
              src={d.url}
              alt={d.name}
            />
               {/* <Icon icon="line-md:heart-filled" className="absolute top-2 right-2 text-xl text-white md:text-2xl lg:text-3xl"/> */}
            </div>
            <p className="mt-2 text-sm font-semibold mr-[60px] lg:mr-[250px]">{d.name}</p>
            <div className="flex justify-center space-x-3 mt-1 mr-[25px] lg:mr-[220px]">
              <div className="flex items-center space-x-1 text-xs">
                {/* <Icon icon="hugeicons:location-09" /> */}
                <p>{d.place}</p>
              </div>
              <div className="flex items-center space-x-1 text-xs">
                {/* <Icon icon="material-symbols:star" /> */}
                <p>{d.rating}</p>
              </div>
            </div>
         
          </div>
        ))}
      </Slider>
       <div className="flex items-center space-x-2 mt-11">
        <h1 className="text-[24px]">Foods</h1>
        {/* <Icon className="text-2xl" icon="lucide:chevron-right" /> */}
      </div>
       <Slider {...settings}>
        {Foods.map((d, i) => (
          <div key={i} className="p-2 text-center">
            <div className="relative w-fit">
            <img
              className="md:w-[225px] md:h-[224px] h-[100px] w-[100px] rounded-[22px] object-cover mx-auto"
              src={d.url}
              alt={d.name}
            />
               {/* <Icon icon="line-md:heart-filled" className="absolute top-2 right-2 text-xl text-white md:text-2xl lg:text-3xl"/> */}
            </div>
            <p className="mt-2 text-sm font-semibold mr-[60px] lg:mr-[250px]">{d.name}</p>
            <div className="flex justify-center space-x-3 mt-1 mr-[25px] lg:mr-[220px]">
              <div className="flex items-center space-x-1 text-xs">
                {/* <Icon icon="hugeicons:location-09" /> */}
                <p>{d.place}</p>
              </div>
              <div className="flex items-center space-x-1 text-xs">
                {/* <Icon icon="material-symbols:star" /> */}
                <p>{d.rating}</p>
              </div>
            </div>
         
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default SliderComponent;