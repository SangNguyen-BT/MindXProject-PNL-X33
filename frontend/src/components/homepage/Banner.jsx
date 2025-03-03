import React from "react";
import Carousel from "react-multi-carousel";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Banner = () => {
  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1,
      slidesToSlide: 1,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1,
      slidesToSlide: 1,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      slidesToSlide: 1,
    },
  };

  const images = [
    "https://static.vecteezy.com/ti/vettori-gratis/p1/5502524-cinema-sfondo-concetto-film-teatro-oggetto-su-sfondo-tenda-rossa-e-tempo-di-film-con-lampadine-elettriche-telaio-illustrazione-gratuito-vettoriale.jpg",
    "https://t3.ftcdn.net/jpg/05/07/67/78/360_F_507677881_lwsOUToBTTOk0mHHPhyudfK4BGS9LGO1.jpg",
  ];

  return (
    <div className="bg-black py-8">
      <div className="container mx-auto px-[180px] relative">
        <Carousel
          responsive={responsive}
          infinite={true}
          autoPlay={true}
          autoPlaySpeed={2000}
          keyBoardControl={true}
          showDots={true}
          arrows={false} 
          renderDotsOutside={true}
          containerClass="carousel-container"
          itemClass="carousel-item"
          customBannerGroup={<CustomBannerGroup />}
        >
          {images.map((image, index) => (
            <div key={index} className="relative">
              <img
                src={image}
                alt={`Banner ${index + 1}`}
                className="w-full max-w-250 h-80"
              />
            </div>
          ))}
        </Carousel>
        <CustomBannerGroup />
      </div>
    </div>
  );
};

const CustomBannerGroup = ({ next, previous }) => {
  return (
    <>
      <button
        className="absolute top-1/2 left-[85px] transform -translate-y-1/2 bg-gray-800 text-white p-4 rounded-full shadow-lg hover:bg-gray-600 transition"
        onClick={previous}
      >
        <FaChevronLeft size={20} />
      </button>
      <button
        className="absolute top-1/2 right-[85px] transform -translate-y-1/2 bg-gray-800 text-white p-4 rounded-full shadow-lg hover:bg-gray-600 transition"
        onClick={next}
      >
        <FaChevronRight size={20} />
      </button>
    </>
  );
};

export default Banner;
