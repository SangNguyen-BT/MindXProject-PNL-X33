import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios"

import Title from "../components/Title";
import { backendUrl } from "../App";

const Payment = () => {
  const location = useLocation();

  const { selectedSeats, movie, screen, selectedTime, date, totalPrice } =
    location.state || {};

  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "",
    email: "",
    city: "",
  });

  const seatNames = selectedSeats.map((seat) => {
    const row = seat.row;
    const seatNumber = seat.seat_id.slice(1); // Extract seat number
    return `${row}${seatNumber}`; // Format like B5, A1, etc.
  });

  const handlePayNow = async () => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/movie/bookticket`,
        {
          showTime: selectedTime.showTime,
          showDate: date,
          movieId: movie._id,
          screenId: screen.screen._id,
          seats: selectedSeats,
          totalPrice,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }
        }
      );

      if (response.data.ok) {
        toast.success("Payment successful! Booking confirmed.");
        // Redirect to a confirmation or home page
        navigate("/", { state: response.data.data });
      } else {
        toast.error(response.data.message || "Payment failed.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Payment failed. Please try again.");
    }
  };

  const getUser = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/auth/getuser`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.data.ok) {
        setUser(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  useEffect(() => {
    getUser()
  }, [])
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
    <div className="container mx-auto  px-[200px] " responsive={responsive}>
      <div className="flex flex-col lg:flex-row justify-between gap-8 lg:gap-12 border-t pt-8 lg:pt-14">
        {/* Left side - Customer Information */}
        <div className="flex flex-col gap-6 w-full lg:w-1/2">
          <div className="text-xl sm:text-2xl mb-4">
            <Title text1="CUSTOMER" text2=" INFORMATION" />
          </div>
          <form className="flex flex-col gap-4">
            <input
              type="text"
              value={user.name}
              readOnly
              placeholder="Name"
              className="border border-gray-300 rounded-lg py-2 px-4 w-full sm:w-auto focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />

            <input
              type="email"
              value={user.email}
              readOnly
              placeholder="Email address"
              className="border border-gray-300 rounded-lg py-2 px-4 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <input
              type="text"
              placeholder="City"
              value={user.city}
              readOnly
              className="border border-gray-300 rounded-lg py-2 px-4 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </form>
        </div>

        {/* Right side - Booking Details*/}
        <div className="w-full lg:w-1/2">
          {/* Booking Details */}
          <div className="mb-8">
            <div className="text-xl sm:text-2xl mb-4 ">
              <Title text1="BOOKING" text2=" DETAILS" />
            </div>
            <ul className="bg-black p-6 space-y-2">
              <li className="text-white flex">
                <strong className="text-yellow-500 w-28">Movie:</strong>
                <span>{movie?.title}</span>
              </li>
              <li className="text-white flex">
                <strong className="text-yellow-500 w-28">Cinema:</strong>
                <span>{screen?.screen?.name}</span>
              </li>
              <li className="text-white flex">
                <strong className="text-yellow-500 w-28">Showtime:</strong>
                <span>{selectedTime?.showTime}</span>
              </li>
              <li className="text-white flex">
                <strong className="text-yellow-500 w-28">Date:</strong>
                <span>{new Date(date).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}</span>
              </li>
              <li className="text-white flex">
                <strong className="text-yellow-500 w-28">Seats:</strong>
                <span>{seatNames.join(", ")}</span>
              </li>
              <li className="text-white flex">
                <strong className="text-yellow-500 w-28">Total Price:</strong>
                <span>${totalPrice}</span>
              </li>
            </ul>

          </div>

          {/* Pay Now Button */}
          <div className="w-full text-start mb-6 mx-6 ">
            <button
              className="bg-blue-600 text-white rounded-lg px-8 py-3 text-sm hover:bg-blue-700 transition-all"
              onClick={handlePayNow}
            >
              PAY NOW
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
