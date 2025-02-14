import React from "react";

const About = () => {
  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 7
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 5
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 4
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1
    }
};
  return (
    <div className=" text-white min-h-screen flex flex-col items-center justify-center p-10" responsive={responsive}>
      <h1 className="text-4xl font-bold mb-6 text-red-500">About Us</h1>
      <p className="text-center text-2xl mb-3 ">
        Welcome to our About page! We are a platform The online movie platform
        offers movies and TV shows the best for global viewers
      </p>
      <p className="text-center text-2xl mb-4">
        With a diverse treasure trove of movies, from action, comedy to
        psychology, they I am committed to providing great entertainment
        experiences. We Constantly expanding its library, updating the latest
        movies and the hottest TV shows from around the world.
      </p>
      <p className="text-center text-2xl mb-4">
        Our team consists of cinema lovers who always Looking for good movies to
        introduce to you. We are not just that a movie viewing platform; We are
        a community where viewers can share opinions, reviews and
        recommendations of their favorite movies.
      </p>
      <p className="text-center text-2xl mb-4">
        Join us to explore your favorite movies and enjoy wonderful moments of
        entertainment! We also recommend We encourage you to follow our social
        media pages to receive Latest information about upcoming movies and
        promotional programs forever and many other interesting things.
      </p>
      <p className="text-center text-2xl mb-4">
        We believe that every movie has its own story, and we Glad to be a part
        of your journey of discovery.
      </p>
      <footer className="mt-6">
        <p className="text-sm">© 2024 Movie. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default About;
