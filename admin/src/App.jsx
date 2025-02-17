import "./App.css";
import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Sidebar from "./components/Sidebar";

import CreateSchedule from "./pages/CreateSchedule";
import ListMovies from "./pages/ListMovies";
import CreateCeleb from "./pages/CreateCeleb";
import ListCinema from "./pages/ListCinema";
import ListSchedule from "./pages/ListSchedule";
import ListBooking from "./pages/ListBooking";

export const backendUrl = import.meta.env.VITE_BACKEND_URL;

function App() {
  const [token, setToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : ""
  );

  useEffect(() => {
    localStorage.setItem("token", token);
  }, [token]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <ToastContainer />
      {token === "" ? (
        <Login setToken={setToken} />
      ) : (
        <>
          <Navbar setToken={setToken} />
          <hr />
          <div className="flex w-full">
            <Sidebar />
            <div className="w-[70%] mx-auto ml-[max(5vw,25px) my-8 text-gray-600 text-base">
              <Routes>
                <Route path="/create-schedule" element={<CreateSchedule />} />
                <Route path="/create-celeb" element={<CreateCeleb />} />
                <Route path="/listmovies" element={<ListMovies />} />
                <Route path="/listcinemas" element={<ListCinema />} />
                <Route path="/listschedules" element={<ListSchedule />} />
                <Route path="/booking" element={<ListBooking />} />
              </Routes>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
