import React, { useEffect, useState } from "react";
import { useLocation, useParams, Link } from "react-router-dom";
import axios from "axios";
import { BsFillStarFill } from "react-icons/bs";

import { backendUrl } from "../App";
import {Responsive} from "../components/Responsive"
const BuyTickets = () => {
  const { movieid, city } = useParams(); // Get params using React Router

  const location = useLocation();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [movie, setMovie] = useState(null);
  const [theatres, setTheatres] = useState(null);
  const [availableDates, setAvailableDates] = useState([]);

  const getAvailableDates = async () => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/movie/getavailabledates/${city}/${movieid}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.ok) {
        setAvailableDates(response.data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

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
        console.log(response.data);
        setMovie(response.data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getTheatres = async (date) => {
    const movieId = movieid;
    const cityname = city;

    try {
      const response = await axios.get(
        `${backendUrl}/api/movie/screensbymovieschedule/${cityname}/${date}/${movieId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.ok) {
        setTheatres(response.data.data);
        console.log(response.data.data);
      } else {
        console.error(response.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getMovie();
    getAvailableDates();
  }, []);

  // Get theaters when the selected date changes
  useEffect(() => {
    getTheatres(selectedDate);
  }, [selectedDate]);
 
  return (
    <>
      {movie  && (
        <div className="bg-gray-200 min-h-screen w-full pb-1" responsive={Responsive}>
          <div>
            <div className="bg-gradient-to-r from-black via-transparent to-black min-h-[50vh] p-12 flex justify-between">
              <div className="flex items-center gap-5">
                <div
                  className="w-[300px] h-[400px] rounded-lg overflow-hidden relative bg-no-repeat bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${movie.portraitImgUrl})`,
                  }}
                >
                  <p className="absolute bottom-0 bg-black text-white text-center w-full py-1 text-sm">
                    In cinemas
                  </p>
                </div>
                <div className="flex flex-col text-white gap-3">
                  <p className="text-4xl font-semibold">{movie.title}</p>
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
                </div>
              </div>
            </div>

            {/* SHOW DATE */}
            <div className="flex justify-center space-x-4 my-5">
              {availableDates.length > 0 ? (
                availableDates.map((date, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedDate(date)}
                    className={`py-2 px-4 rounded-full transition-all duration-300 ${
                      selectedDate === date
                        ? "bg-red-500 text-white"
                        : "bg-white text-black"
                    }`}
                  >
                    {new Date(date).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </button>
                ))
              ) : (
                <p className="text-gray-500 text-lg font-semibold">
                  No Schedule for this movie yet
                </p>
              )}
            </div>
          </div>

          {theatres && theatres.length > 0 && (
            <div className="w-11/12 mx-auto my-5 shadow-lg bg-white p-5 rounded-lg">
              {theatres.map((screen, index) => {
                // Lọc các lịch chiếu theo ngày được chọn
                const filteredSchedules = screen.movieSchedules.filter(
                  (schedule) => {
                    const scheduleDate = new Date(schedule.showDate)
                      .toISOString()
                      .split("T")[0];

                    const selectedDateString = new Date(selectedDate)
                      .toISOString()
                      .split("T")[0];

                    return (
                      scheduleDate === selectedDateString &&
                      String(schedule.movieId) === String(movieid)
                    );
                  }
                );
                console.log(filteredSchedules);

                return (
                  <div
                    className="flex justify-between items-center my-2 py-3 border-b border-gray-200 last:border-none cursor-pointer transition-all duration-300"
                    key={screen._id}
                  >
                    <div className ="w-1/3">
                      <h3 className="text-lg font-semibold">
                        {screen.name} - {screen.screenType}
                      </h3>
                      <h3 className="text-sm font-semibold">
                        {screen.location}
                      </h3>
                    </div>

                    {/* Render phần showTimes */}
                    <div className="w-1/3 flex flex-col items-center">
                      {filteredSchedules.length > 0 && (
                        <div className="text-sm text-center">
                          <h2 className="font-semibold">Show Times:</h2>
                          <div className="flex flex-wrap gap-2 justify-center">
                            {filteredSchedules.map((schedule, index) => (
                              <span
                                key={index}
                                className="py-1 px-3 bg-gray-100 rounded-full text-gray-800 shadow-sm"
                              >
                                {schedule.showTime}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <Link
                        to={`${location.pathname}/${screen._id}?date=${selectedDate}`}
                        className="bg-red-500 text-white px-4 py-2 rounded"
                      >
                        Select
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default BuyTickets;
