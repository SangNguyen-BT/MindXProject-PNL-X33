import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import image from "../assets/movie-icon.jpg";

const Sidebar = () => {
  const [isUserManagementOpen, setIsUserManagementOpen] = useState(false);
  const [isListsOpen, setIsListsOpen] = useState(false);

  const toggleUserManagement = () => {
    setIsUserManagementOpen(!isUserManagementOpen);
  };

  const toggleLists = () => {
    setIsListsOpen(!isListsOpen);
  };

  return (
    <div className="w-[18%] min-h-screen border-r-2">
      <div className="flex flex-col gap-4 pt-6 pl-[20%] text-[15px]">
        {/* Users Management Section */}
        <div className="flex flex-col gap-3">
          <button
            onClick={toggleUserManagement}
            className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l"
          >
            <img className="w-5 h-5" src={image} alt="" />
            <p className="hidden md:block">Users Management</p>
          </button>

          {/* Collapsible Management Items */}
          {isUserManagementOpen && (
            <div className="flex flex-col gap-3 ml-4">
              <NavLink
                to="/bookings"
                className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l"
              >
                <img className="w-5 h-5" src={image} alt="" />
                <p className="hidden md:block">List Bookings</p>
              </NavLink>

              <NavLink
                to="/users"
                className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l"
              >
                <img className="w-5 h-5" src={image} alt="" />
                <p className="hidden md:block">List Users</p>
              </NavLink>
            </div>
          )}
        </div>

        {/* List All Section */}
        <div className="flex flex-col gap-3">
          <button
            onClick={toggleLists}
            className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l"
          >
            <img className="w-5 h-5" src={image} alt="" />
            <p className="hidden md:block">Lists Management</p>
          </button>

          {/* Collapsible List Items */}
          {isListsOpen && (
            <div className="flex flex-col gap-3 ml-4">
              <NavLink
                to="/listmovies"
                className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l"
              >
                <img className="w-5 h-5" src={image} alt="" />
                <p className="hidden md:block">All Movies</p>
              </NavLink>

              <NavLink
                to="/listcinemas"
                className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l"
              >
                <img className="w-5 h-5" src={image} alt="" />
                <p className="hidden md:block">All Cinemas</p>
              </NavLink>

              <NavLink
                to="/listschedules"
                className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l"
              >
                <img className="w-5 h-5" src={image} alt="" />
                <p className="hidden md:block">All Schedules</p>
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
