import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

import { backendUrl } from "../App";
import image from "../assets/noteicon.jpg";

const ListSchedule = () => {
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState([]);
  
  const [filteredSchedules, setFilteredSchedules] = useState([]);

  // Lọc Movie //
  const [movieNames, setMovieNames] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState("");

  // Lọc Cinema //
  const [screenNames, setScreenNames] = useState([]);
  const [selectedScreen, setSelectedScreen] = useState("");

  // Modal // State quản lý form modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [formData, setFormData] = useState({
    movieName: "",
    showTime: "",
    showDate: "",
    notAvailableSeats: [],
    totalPrice: "",
  });

  const handleDeleteSchedule = async (scheduleId) => {
    try {
      const response = await axios.delete(
        `${backendUrl}/api/movie/screens/${selectedSchedule.screenId}/movie-schedules/${scheduleId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      if (response.data.ok) {
        // Loại bỏ lịch chiếu khỏi list
        const updatedSchedules = schedules.filter(
          (schedule) => schedule._id !== scheduleId
        );
        setSchedules(updatedSchedules);
        toast.success("Schedule deleted successfully");
      }
    } catch (error) {
      toast.error("Error deleting schedule");
    }
  };

  const fetchSchedules = async () => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/movie/movieschedules`
      );

      if (response.data.ok && response.data.data.length > 0) {
        setSchedules(response.data.data);

        setFilteredSchedules(response.data.data);

        const uniqueMovies = [
          ...new Set(response.data.data.map((schedule) => schedule.movieName)),
        ];
        setMovieNames(uniqueMovies);

        const uniqueScreens = [
          ...new Set(response.data.data.map((schedule) => schedule.screenName)),
        ];
        setScreenNames(uniqueScreens);

        toast.success(response.data.message);
      } else {
        toast.warn("No schedules available");
      }
    } catch (error) {
      toast.error("Error fetching movie schedules");
    }
  };

  const handleFilterChange = (movieName, screenName) => {
    setSelectedMovie(movieName); // Cập nhật movie chọn
    setSelectedScreen(screenName); // Cập nhật screen chọn

    let filtered = schedules;

    if (movieName) {
      filtered = filtered.filter(
        (schedule) => schedule.movieName === movieName
      );
    }

    if (screenName) {
      filtered = filtered.filter(
        (schedule) => schedule.screenName === screenName
      );
    }

    setFilteredSchedules(filtered);
  };

  const handleSeatChange = (e, index, field) => {
    const updatedSeats = [...formData.notAvailableSeats];
    updatedSeats[index][field] = e.target.value; // Tên trường cần cập nhật (ví dụ: seat_id, row, col).
    setFormData({ ...formData, notAvailableSeats: updatedSeats });
  };

  const handleAddSeat = () => {
    setFormData((prevformData) => ({
      ...prevformData,
      notAvailableSeats: [
        ...(prevformData.notAvailableSeats || []), 
        { seat_id: "", row: "", price: "" }, 
      ],
    }));
  };

  const handleRemoveSeat = (index) => {
    const updatedSeats = [...formData.notAvailableSeats];
    updatedSeats.splice(index, 1); 
    setFormData({ ...formData, notAvailableSeats: updatedSeats });
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(
        `${backendUrl}/api/movie/screens/${selectedSchedule.screenId}/movie-schedules/${selectedSchedule._id}`,
       formData, 
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      if (response.data.ok) {
        // Cập nhật lại dữ liệu sau khi sửa
        const updatedSchedules = schedules.map((schedule) =>
          schedule._id === selectedSchedule._id
            ? { ...schedule, ...formData }
            : schedule
        );
        setSchedules(updatedSchedules);
        toast.success("Schedule updated successfully");

        setIsModalOpen(false);

        fetchSchedules();
      }
    } catch (error) {
      toast.error("Error updating schedule");
    }
  };

  const openEditModal = (schedule) => {
    setSelectedSchedule(schedule); // Lưu thông tin lịch chiếu cần chỉnh sửa
    setFormData({
      movieName: schedule.movieName,
      showTime: schedule.showTime,
      showDate: schedule.showDate,
      notAvailableSeats: schedule.notAvailableSeats,
      screenId: schedule.screenId,
      totalPrice: schedule.totalPrice,
    });
    setIsModalOpen(true);
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  return (
    <div className="p-6">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold">All Movie Schedules</h2>
        <button
          onClick={() => navigate("/create-schedule")}
          className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition"
        >
          Add Schedule
        </button>
      </div>

      {/* Filter Section */}
      {/* By Movie */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <label
          htmlFor="movieFilter"
          className="block mb-2 text-sm font-medium text-gray-600"
        >
          Filter by Movie Name
        </label>
        <select
          id="movieFilter"
          value={selectedMovie}
          onChange={(e) => handleFilterChange(e.target.value)}
          className="p-2 border border-gray-300 rounded-md sm:w-64"
        >
          <option value="">All Movies</option>
          {movieNames.map((movie, index) => (
            <option key={index} value={movie}>
              {movie}
            </option>
          ))}
        </select>
      </div>
      {/* By Cinema */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <label
          htmlFor="screenFilter"
          className="block mb-2 text-sm font-medium text-gray-600"
        >
          Filter by Screen Name
        </label>
        <select
          id="screenFilter"
          value={selectedScreen}
          onChange={(e) => handleFilterChange(selectedMovie, e.target.value)}
          className="p-2 border border-gray-300 rounded-md sm:w-64"
        >
          <option value="">All Screens</option>
          {screenNames.map((screen, index) => (
            <option key={index} value={screen}>
              {screen}
            </option>
          ))}
        </select>
      </div>

      {/* Schedules Table */}
      {filteredSchedules.length > 0 ? (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th className="px-6 py-3">No.</th>
                <th className="px-6 py-3">Movie Name - Cinema</th>
                <th className="px-6 py-3">Show Date</th>
                <th className="px-6 py-3">Show Time</th>
                <th className="px-6 py-3">Unavailable Seats</th>
                <th className="px-6 py-3">Action</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {filteredSchedules.map((schedule, index) => (
                <tr
                  key={index}
                  className={`${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-blue-100 dark:hover:bg-gray-700`}
                >
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                    {index + 1} .
                  </td>
                  <td className="px-6 py-4 font-semibold text-blue-600 dark:text-blue-400">
                    {schedule.movieName} - {schedule.screenName}
                  </td>
                  <td className="px-6 py-4 text-green-600 dark:text-green-400">
                    {new Date(schedule.showDate).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-4 text-purple-600 dark:text-purple-400">
                    {schedule.showTime}
                  </td>
                  <td className="px-6 py-4">
                    {schedule.notAvailableSeats &&
                    schedule.notAvailableSeats.length > 0 ? (
                      <ul className="list-disc pl-4">
                        {schedule.notAvailableSeats.map((seat, seatIndex) => (
                          <li
                            key={seatIndex}
                            className="text-red-500 dark:text-red-400"
                          >
                            Seat: {seat.seat_id}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-green-400 italic">
                        All seats available
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <img
                        src={image}
                        alt="Edit"
                        className="cursor-pointer text-white hover:text-blue-700 w-5"
                        onClick={() => openEditModal(schedule)}
                      />

                      <span
                        className="cursor-pointer text-red-500 hover:text-red-700"
                        onClick={() => handleDeleteSchedule(schedule._id)}
                      >
                        X
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="mt-4 text-gray-500 text-center">
          No schedules to display.
        </p>
      )}

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-96 p-6">
            <h2 className="text-xl font-bold mb-4">Edit Schedule</h2>
            <form>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Movie Name
                </label>
                <input
                  type="text"
                  value={formData.movieName}
                  onChange={(e) =>
                    setFormData({ ...formData, movieName: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Enter movie name"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Show Time
                </label>
                <input
                  type="time"
                  value={formData.showTime}
                  onChange={(e) =>
                    setFormData({ ...formData, showTime: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Show Date
                </label>
                <input
                  type="date"
                  value={
                    new Date(formData.showDate).toISOString().split("T")[0]
                  }
                  onChange={(e) =>
                    setFormData({ ...formData, showDate: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              {/* Not Available Seats */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Unavailable Seats
                </label>
                <div>
                  {formData.notAvailableSeats &&
                  formData.notAvailableSeats.length > 0 ? (
                    <ul className="list-disc pl-5 text-red-600">
                      {formData.notAvailableSeats.map((seat, index) => (
                        <li key={index} className="mb-2">
                          <div className="flex space-x-2">
                            <div>
                              <label htmlFor="">Seat </label>
                              <input
                                type="text"
                                className="border p-1 rounded-md w-10"
                                value={seat.seat_id}
                                onChange={(e) =>
                                  handleSeatChange(e, index, "seat_id")
                                }
                                
                              />
                            </div>

                            <div>
                              <label htmlFor="">Row </label>
                              <input
                                type="text"
                                className="border p-1 rounded-md w-6"
                                value={seat.row}
                                onChange={(e) =>
                                  handleSeatChange(e, index, "row")
                                }
                                
                              />
                            </div>

                            <div>
                              <label htmlFor="">Col </label>
                              <input
                                type="text"
                                className="border p-1 rounded-md w-6"
                                value={seat.col}
                                onChange={(e) =>
                                  handleSeatChange(e, index, "col")
                                }
                                
                              />
                            </div>

                            <div>
                              <label htmlFor="">Price </label>
                              <input
                                type="text"
                                className="border p-1 rounded-md w-8"
                                value={seat.price}
                                onChange={(e) =>
                                  handleSeatChange(e, index, "price")
                                }
                                
                              />
                            </div>

                            {/* Button xóa ghế */}
                            <button
                            type="button"
                              className="text-red-500 font-semibold pl-4"
                              onClick={() => handleRemoveSeat(index)}
                            >
                              X
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div>
                      <p className="text-green-600">All seats available</p>
                    </div>
                  )}

                  
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListSchedule;
