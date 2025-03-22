import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BsFillStarFill } from "react-icons/bs";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { backendUrl } from "../../App";

const MovieSearch = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const { keyword } = useParams();
  const navigate = useNavigate();

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
        setUser(null)
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      setUser(null)
    }
  };

  useEffect(() => {
    const searchMovies = async () => {
      if (keyword) {
        setLoading(true);
        setError(null);

        try {
          const response = await axios.get(
            `${backendUrl}/api/movie/search/${keyword}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          setMovies(response.data.data);
        } catch (error) {
          setError("Error fetch movies");
        } finally {
          setLoading(false);
        }
      }
    };

    searchMovies();
    getUser();
  }, [keyword]);

  const handleDetailClick = (movieId) => {
    if (!user) {
      toast.error("You need to login !");
      navigate("/Login");
    } else {
      navigate(`/${user.city}/movies/${movieId}`);
    }
  };

  return (
    <div className="bg-black min-h-screen p-10">
      <h1 className="text-3xl text-red-600 mb-4">
        Kết quả tìm kiếm cho: {keyword}
      </h1>

      {loading ? (
        <p className="text-white">Đang tìm kiếm...</p>
      ) : (
        <div className="mt-4">
          {movies.length > 0 ? (
            <ul className="space-y-4">
              {movies.map((movie) => (
                <li
                  key={movie._id}
                  className="text-white p-4 rounded-lg shadow-md flex items-center"
                >
                  <img
                    src={movie.portraitImgUrl}
                    alt={movie.title}
                    className="w-60 h-auto rounded mr-4"
                  />

                  <div className="flex flex-col justify-center">
                    {" "}
                    <h1 className="text-xl text-white font-semibold">
                      {movie.title}
                    </h1>
                    <p>{movie.description}</p>
                    <p className="font-bold text-yellow-400 text-xl leading-10 flex">
                      Rating:{" "}
                      <BsFillStarFill className="text-yellow-500 mt-2 ml-2" />
                      &nbsp;&nbsp;{movie.rating}/5
                    </p>
                    <button
                      type="button"
                      className="bg-red-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-red-700 transition-all duration-300 w-max mt-2"
                      onClick={() => handleDetailClick(movie._id)}
                    >
                      Detail
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-white">Không tìm thấy phim nào.</p>
          )}
        </div>
      )}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default MovieSearch;
