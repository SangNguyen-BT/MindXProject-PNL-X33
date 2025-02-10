import React from "react";
import "react-multi-carousel/lib/styles.css";

import { useNavigate } from "react-router-dom";
import { BsFillStarFill } from "react-icons/bs";

const MovieCard = (data) => {
  const navigate = useNavigate();
  const { _id, title, genre, rating, portraitImgUrl, duration } = data.Movie;
  const { city } = data.user;

  return (
    <div
      className="overflow-hidden shadow-lg flex flex-col gap-10 mb-4 relative cursor-pointer transform transition-transform duration-300 w-full group"
      onClick={() => {
        navigate(`/${city}/movies/${_id}`)
        window.scrollTo({top: 0, behavior: "smooth"});
      }}
    >
      <div className="relative w-full px-8">
        <img
          src={portraitImgUrl}
          alt={title}
          className="w-full max-w-sm h-auto object-cover"
        />

        {/* Transparent overlay with content */}
        <div className="absolute inset-0 bg-black/70 opacity-0 hover:opacity-100 flex flex-col justify-center px-11 transition-opacity duration-300">
          <p className="text-white text-[18px] font-bold mb-4 group-hover:text-yellow-500">{title}</p>
          <p className="text-gray-300 text-[14px] font-medium">
            <i className="fa fa-tag text-yellow-500 pr-2"></i>
            {genre.join(", ")}
          </p>
          <p className="text-gray-400 text-[14px] font-medium mt-1">
            <i className="fa fa-clock text-yellow-500 pr-2"></i>
            {duration} mins
          </p>
          <p className="text-gray-400 text-[14px] font-medium mt-1">
            <i className="fa fa-globe-americas text-yellow-500 pr-2"></i>USA
          </p>

          <b className="flex items-center text-gray-400 text-[14px] font-medium mt-1">
            <BsFillStarFill className="text-yellow-400" />
            &nbsp;&nbsp;{rating}/5
          </b>
        </div>
      </div>
      <div className="px-3 bg-black text-center">
        <p className="text-[18px] font-bold text-white group-hover:text-yellow-500 break-words">{title}</p>
      </div>
    </div>
  );
};

export default MovieCard;
