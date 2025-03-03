import React from "react";

import Banner from "../components/homepage/Banner";
import MovieList from "../components/homepage/MovieList";

const HomePage = () => {
  
  return (
    <>
      <Banner className='w-full aspect-[4/3]'/>

      <h1 className="text-white text-center font-bold sm:text-3xl md:text-4xl lg:text-4xl tracking-wide uppercase my-4 px-2">
        On Showing Movies
      </h1>
      <MovieList  />
    </>
  );
};

export default HomePage;
