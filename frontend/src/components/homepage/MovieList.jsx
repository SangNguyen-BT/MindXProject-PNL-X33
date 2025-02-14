import React, { useState, useEffect } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import axios from "axios";
// import CustomButtonGroup from "./CustomButtonGroup";
import MovieCard from "./MovieCard";
import {backendUrl} from "../../App"

const MovieList = () => {
  const [user, setUser] = useState(null);
  const [movies, setMovies] = useState([]);

  const getUser = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/auth/getuser`, {
          headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
          }
      });
      if (response.data.ok) {
          setUser(response.data.data); 
      } else {
          window.location.href = "/Login";
      }
  } catch (error) {
      console.error("Error fetching user:", error);
      // window.location.href = "/Login"; 
  }
  };

  const getMovies = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/movie/movies`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.data.ok) {
        setMovies(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  useEffect(() => {
    getMovies();
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
      {movies.length > 0 && (
        <>
       <Carousel
  responsive={responsive}
  infinite={false}
  arrows={true}
  showDots={true}
  autoPlay={false}
  customTransition="all 0.5s"
  transitionDuration={500}
  containerClass="carousel-container"
  itemClass="carousel-item-padding-40-px"
  renderButtonGroupOutside={true} 
  // customButtonGroup={<CustomButtonGroup />}
  customDotListClass="custom-dots"
>
            {movies.map((Movie) => (
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

export default MovieList;
