import React from "react";

import Banner from "../components/homepage/Banner";
import MovieList from "../components/homepage/MovieList";
import UpcomingMovie from "../components/homepage/UpcomingMovie";

const HomePage = () => {
  
  return (
    <>
      <Banner className='w-full aspect-[4/3]'/>

      <h1 className="text-white text-center font-bold sm:text-3xl md:text-4xl lg:text-4xl tracking-wide uppercase my-4 px-2">
        On Showing Movies
      </h1>
      <MovieList />

      <h1 className="text-white text-center font-bold sm:text-3xl md:text-4xl lg:text-4xl tracking-wide uppercase mb-4 mt-20 px-2">
        Coming Soon
      </h1>
      <UpcomingMovie />
    </>
  );
};

export default HomePage;
