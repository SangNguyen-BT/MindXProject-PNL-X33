import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BsFillStarFill } from "react-icons/bs";
import axios from "axios";

import "swiper/css";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

import { backendUrl } from "../App";
import {Responsive} from "../components/Responsive"
import MovieList from "../components/homepage/MovieList";
import CelebCard from "../components/detailmoviepage/CelebCard";

const MovieDetail = () => {
  const { movieid, city } = useParams(); // Get movie ID from URL

  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);

  const getMovie = async () => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/movie/movies/${movieid}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.ok) {
        setMovie(response.data.data);
      } else {
        console.error("Failed to fetch movie data:", response.data.message);
      }
    } catch (err) {
      console.error("Error fetching movie:", err);
    }
  };

  useEffect(() => {
    getMovie();
  }, [movieid]);
 
  return (
    <>
      {movie && (
        <div className="flex flex-col px-[140px]" responsive={Responsive}>
          <div
            className="bg-no-repeat bg-cover bg-center"
            style={{
              backgroundImage: `url(${movie.portraitImgUrl})`,
            }}
          >
            <div className="bg-gradient-to-r from-black via-transparent to-black min-h-[50vh] p-12 flex justify-between">
              <div className="flex items-center gap-5">
                <div
                  className="w-[300px] h-[450px] rounded-lg overflow-hidden relative bg-no-repeat bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${movie.portraitImgUrl})`,
                  }}
                >
                  <p className="absolute bottom-0 bg-black text-white text-center w-full py-1 text-sm">
                    In cinemas
                  </p>
                </div>
                <div className="flex flex-col text-white gap-3">
                  <p className="text-4xl font-semibold  ">{movie.title}</p>
                  <p className="text-3xl font-semibold flex items-center gap-1">
                    <BsFillStarFill className="text-yellow-500 mb-2" />
                    &nbsp;&nbsp;{movie.rating}/5
                  </p>
                  <p className="text-lg font-medium mb-2">
                    <i className="fa fa-clock text-yellow-500 px-2"></i>
                    {movie.duration} mins
                  </p>
                  <p className="text-lg font-medium mb-4 text-gray-300">
                    <i className="fa fa-tag text-yellow-500 px-2"></i>
                    {movie.genre.join(", ")}
                  </p>
                  <button
                    className="bg-yellow-500 text-white rounded-md px-16 py-2 text-lg font-normal"
                    onClick={() =>
                      navigate(`/${city}/movies/${movieid}/buytickets`)
                    } // Redirect to the booking page
                  >
                    Book Tickets
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="px-12 pt-5 flex flex-col gap-3 w-full" responsive={Responsive}>
            <h1 className="text-2xl font-semibold text-blue-700">
              About the Movie
            </h1>
            <p className="text-lg font-normal  text-white">
              {movie.description}
            </p>
            {movie.cast.length > 0 && (
              <div>
                <div className="w-full h-[1px] bg-gray-200 my-8"></div>
                <h1 className="text-2xl font-semibold text-blue-700">Cast</h1>
                <Swiper
                  slidesPerView={1}
                  spaceBetween={1}
                  pagination={{ clickable: true }}
                  breakpoints={{
                    "@0.00": {
                      slidesPerView: 1,
                      spaceBetween: 2,
                    },
                    "@0.75": {
                      slidesPerView: 2,
                      spaceBetween: 2,
                    },
                    "@1.00": {
                      slidesPerView: 3,
                      spaceBetween: 2,
                    },
                    "@1.50": {
                      slidesPerView: 6,
                      spaceBetween: 2,
                    },
                  }}
                  modules={[Pagination]}
                  className="mySwiper"
                >
                  {movie.cast.map((cast, index) => (
                    <SwiperSlide key={index}>
                      <CelebCard
                        imageUrl={cast.celebImage} 
                        name={cast.celebName}
                        role={cast.celebRole}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            )}

            <div className="w-full h-[1px] bg-gray-200 my-8"></div>
            <h1 className="text-2xl font-semibold text-blue-700" responsive={Responsive}>
              Your might also like
            </h1>
            <MovieList />
          </div>
        </div>
      )}
    </>
  );
};

export default MovieDetail;
