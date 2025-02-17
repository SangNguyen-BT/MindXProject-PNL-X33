import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

import image from "../assets/noteicon.jpg";
import { backendUrl } from "../App";
import CreateCinemaPage from "../components/CreateCinema";

const ListCinema = () => {
  const [city, setCity] = useState("");
  const [screens, setScreens] = useState([]);
  const [editScreen, setEditScreen] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddCinema, setShowAddCinema] = useState(false);

  const getScreensByCity = async () => {
    try {
      if (city === "") return toast.error("Please insert a city");

      const response = await axios.get(
        `${backendUrl}/api/movie/screensbycity/${city}`
      );
      if (response.data.ok && response.data.data.length > 0) {
        setScreens(response.data.data);
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error("No cinemas found in specified city");
    }
  };

  const removeScreen = async (id) => {
    try {
      await axios.post(
        `${backendUrl}/api/movie/removescreen`,
        { id },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      setScreens((prev) => prev.filter((screen) => screen._id !== id));
      toast.success("Cinema removed successfully");
    } catch (error) {
      toast.error("Failed to delete cinema");
    }
  };

  const handleEdit = (screen) => {
    setEditScreen(screen);
    setShowModal(true);
  };

  const handleSaveEdit = async () => {
    try {
      const response = await axios.put(
        `${backendUrl}/api/movie/updatescreen/${editScreen._id}`,
        editScreen,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      if (response.data.ok) {
        setScreens((prev) =>
          prev.map((screen) =>
            screen._id === editScreen._id ? editScreen : screen
          )
        );
        toast.success("Cinema updated successfully");
        setShowModal(false);
      }
    } catch (error) {
      toast.error("Failed to update cinema");
    }
  };

  return (
    <div className="p-6">
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:space-x-4 sm:justify-between">
        {/* City Search Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
          <input
            type="text"
            name="city"
            id="city"
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="p-2 border border-gray-300 rounded-md w-full sm:w-64"
          />
          <button
            onClick={() => getScreensByCity()}
            className="mt-2 sm:mt-0 bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition w-full sm:w-auto"
          >
            Search
          </button>
        </div>

        <button
          onClick={() => setShowAddCinema(true)}
          className="mt-2 sm:mt-0 bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition w-full sm:w-auto sm:ml-auto"
        >
          Add Cinema
        </button>
      </div>

      {/* Cinema List Section */}
      {screens.length > 0 ? (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-center text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th className="px-6 py-3">No.</th>
                <th className="px-6 py-3">CINEMAS</th>
                <th className="px-6 py-3">Location</th>
                <th className="px-6 py-3">City</th>
                <th className="px-6 py-3">Screen Type</th>
                <th className="px-6 py-3">Movie Schedules</th>
                <th className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {screens.map((screen, index) => (
                <tr
                  key={index}
                  className="odd:bg-white text-center odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
                >
                  <td className="px-6 py-4 font-medium">{index + 1} .</td>
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {screen.name}
                  </td>
                  <td className="px-6 py-4">{screen.location}</td>
                  <td className="px-6 py-4">{screen.city}</td>
                  <td className="px-6 py-4">{screen.screenType}</td>
                  <td className="px-6 py-4">
                    {screen.movieSchedules.length > 0 ? (
                      <ul className="list-disc pl-4">
                        {screen.movieSchedules.map(
                          (schedule, scheduleIndex) => (
                            <li key={scheduleIndex} className="mb-2">
                              <span className="text-blue-500 font-semibold">
                                {schedule.movieName}
                              </span>{" "}
                              /{" "}
                              <span className="text-green-500">
                                {schedule.showTime}
                              </span>{" "}
                              /{" "}
                              <span className="text-purple-500">
                                {schedule.showDate.slice(0, 10)}
                              </span>
                            </li>
                          )
                        )}
                      </ul>
                    ) : (
                      <span>No schedules</span>
                    )}
                  </td>

                  {/* Button */}
                  <td className="pl-3 py-[100%] flex flex-row gap-6">
                    <img
                      src={image}
                      onClick={() => handleEdit(screen)}
                      className="cursor-pointer text-white hover:text-blue-700 w-5"
                    />
                    <span
                      onClick={() => removeScreen(screen._id)}
                      className="cursor-pointer text-red-500 hover:text-red-700"
                    >
                      X
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="mt-4 text-gray-500">No cinemas to display.</p>
      )}

      {/* Add Cinema Toggle */}
      {showAddCinema && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end">
          <div className="bg-white w-1/3 h-full p-8 relative">
            <button
              onClick={() => setShowAddCinema(false)}
              className="absolute top-3 right-4 text-gray-500 hover:text-gray-800"
            >
              X
            </button>
            <CreateCinemaPage setShowAddCinema={setShowAddCinema} />
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-xl font-semibold mb-4">Edit Cinema</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                value={editScreen.name}
                onChange={(e) =>
                  setEditScreen((prev) => ({ ...prev, name: e.target.value }))
                }
                className="p-2 border border-gray-300 rounded-md w-full"
              />
              <input
                type="text"
                placeholder="Location"
                value={editScreen.location}
                onChange={(e) =>
                  setEditScreen((prev) => ({
                    ...prev,
                    location: e.target.value,
                  }))
                }
                className="p-2 border border-gray-300 rounded-md w-full"
              />
              <input
                type="text"
                placeholder="City"
                value={editScreen.city}
                onChange={(e) =>
                  setEditScreen((prev) => ({ ...prev, city: e.target.value }))
                }
                className="p-2 border border-gray-300 rounded-md w-full"
              />
              <input
                type="text"
                placeholder="Screen Type"
                value={editScreen.screenType}
                onChange={(e) =>
                  setEditScreen((prev) => ({
                    ...prev,
                    screenType: e.target.value,
                  }))
                }
                className="p-2 border border-gray-300 rounded-md w-full"
              />
            </div>
            <div className="flex justify-end space-x-4 mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 p-2 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListCinema;
