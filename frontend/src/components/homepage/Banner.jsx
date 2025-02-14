import React from "react";
import Carousel from "react-multi-carousel";

const Banner = () => {
  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1,
      slidesToSlide: 1, // Number of slides to scroll
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
      <div className="container  mx-auto px-[180px]">
        <Carousel
          responsive={responsive}
          infinite={true}
          autoPlay={true}
          autoPlaySpeed={3000}
          keyBoardControl={true}
          showDots={true}
          arrows={true}
          containerClass="carousel-container"
          itemClass="carousel-item"
          dotListClass="custom-dot-list-style justify-content: space-between"
          className="rounded-lg overflow-hidden shadow-lg "
          renderDotsOutside={true}
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
      </div>

    </div>
  );
};

export default Banner;
