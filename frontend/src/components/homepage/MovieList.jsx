import React, { useState, useEffect } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import axios from "axios";

import MovieCard from "./MovieCard";
import { backendUrl } from "../../App";

const MovieList = () => {
  const [user, setUser] = useState(null);
  const [onShowingMovies, setOnShowingMovies] = useState([]);

  const getOnShowingMovies = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/movie/onshowing`);
      if (response.data.ok) {
        setOnShowingMovies(response.data.movies);
      }
    } catch (error) {
      console.error("Error fetching on-showing movies:", error);
    }
  };

  const getUser = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/auth/getuser`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.data.ok) {
        setUser(response.data.data);
      } else {
        window.location.href = "/Login";
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      window.location.href = "/Login";
    }
  };

  useEffect(() => {
    getOnShowingMovies();
    getUser();
  }, []);

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 4, // Show 4 movies on large screens
      slidesToSlide: 4, // Slide 4 at a time
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2, // Show 2 movies on medium screens
      slidesToSlide: 2, // Slide 2 at a time
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1, // Show 1 movie on small screens
      slidesToSlide: 1, // Slide 1 at a time
    },
  };

  return (
    <div className="rounded-lg shadow-md relative my-10 mx-auto px-[150px]">
      {onShowingMovies.length > 0 && user && (
        <>
          <Carousel
            responsive={responsive}
            infinite={false}
            arrows={false}
            showDots={false}
            autoPlay={false}
            customTransition="all 0.5s"
            transitionDuration={500}
            containerClass="carousel-container"
            itemClass="carousel-item-padding-40-px"
            renderButtonGroupOutside={true}
            customButtonGroup={<CustomButtonGroup />}
          >
            {onShowingMovies.map((Movie) => (
              <div
                key={Movie._id}
                className="flex flex-row justify-between gap-4"
              >
                <MovieCard Movie={Movie} user={user} />
              </div>
            ))}
          </Carousel>
        </>
      )}
    </div>
  );
};
const CustomButtonGroup = ({ next, previous }) => {
  return (
    <>
      <button
        className="absolute top-1/2 left-[90px] transform -translate-y-1/2 bg-gray-800 text-white p-4 rounded-full shadow-lg hover:bg-gray-600 transition"
        onClick={previous}
      >
        <FaChevronLeft size={20} />
      </button>
      <button
        className="absolute top-1/2 right-[90px] transform -translate-y-1/2 bg-gray-800 text-white p-4 rounded-full shadow-lg hover:bg-gray-600 transition"
        onClick={next}
      >
        <FaChevronRight size={20} />
      </button>
    </>
  );
};

export default MovieList;
