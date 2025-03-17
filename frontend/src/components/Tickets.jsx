import React, { useState, useEffect } from "react";
import axios from "axios";
import {toast} from "react-toastify"
import { backendUrl } from "../App";
import ProfileNav from "./ProfileNav";

const MyProfile = () => {
  const [bookings, setBookings] = useState(null);
  const [loading, setLoading] = useState(false);

  const getBookings = async () => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/movie/getuserbookings`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.ok) {
        console.log(response.data.data);
        setBookings(response.data.data);
      } else {
        console.error(data);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const cancelBooking = async (bookingId) => {
    
    if (!window.confirm("Are you sure to delete this booking?")) return;
  
    setLoading(true);
    try {
      const response = await axios.delete(`${backendUrl}/api/movie/removebooking/${bookingId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
  
      if (response.data.message === "Ticket cancelled successfully") {
        toast.success("Ticket cancelled successfully");
        setBookings(bookings.filter((booking) => booking._id !== bookingId));
      }
    } catch (error) {
      console.error("Error deleting booking", error);
      toast.error("Booking delete error!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBookings();
  }, []);

  return (
    <>
    <ProfileNav/>
    <div className="max-w-2xl mx-auto p-5 flex flex-col gap-5 items-center">
      <div className="mt-5 w-full flex flex-col items-center justify-center">
        <h2 className="text-xl font-semibold text-white">Booking Detail</h2>
        <div className="flex flex-wrap gap-2.5 w-full justify-center">
          {/* BOOKING CARD */}
          {bookings?.map((booking) => (
            <div
              className="my-5 border border-gray-300 rounded p-4"
              key={booking._id}
            >
              <div className="flex items-center mb-2.5">
                <h3 className="mr-2.5 text-red-100 font-normal">Movie</h3>
                <p className="m-0 text-yellow-300">{booking.movieTitle}</p>
              </div>
              <div className="flex items-center mb-2.5">
                <h3 className="mr-2.5 text-red-100 font-normal">Cinema</h3>
                <p className="m-0 text-yellow-300">{booking.screenName}</p>
              </div>
              <div className="flex items-center mb-2.5">
                <h3 className="mr-2.5 text-red-100 font-normal">Location</h3>
                <p className="m-0 text-yellow-300">
                  {booking.screenId?.location}
                </p>
              </div>
              <div className="flex items-center mb-2.5">
                <h3 className="mr-2.5 text-red-100 font-normal">Seats</h3>
                <p className="m-0 text-yellow-300">
                  {booking.seats.map((seat, index) => {
                    return (
                      <span className="flex gap-2" key={index}>
                        {seat.seat_id}{" "}
                      </span>
                    );
                  })}
                </p>
              </div>
              <div className="flex items-center mb-2.5">
                <h3 className="mr-2.5 text-red-100 font-normal">Price Paid</h3>
                <p className="m-0 text-yellow-300">$ {booking.totalPrice}</p>
              </div>

              <div className="flex items-center mb-2.5">
                <h3 className="mr-2.5 text-red-100 font-normal">Show Date</h3>
                <p className="m-0 text-yellow-300">
                  {new Date(booking.showDate).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div className="flex items-center mb-2.5">
                <h3 className="mr-2.5 text-red-100 font-normal">Show Time</h3>
                <p className="m-0 text-yellow-300">{booking.showTime}</p>
              </div>

              {/* Button Cancel Booking */}
              <button
                  onClick={() => cancelBooking(booking._id)}
                  className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition disabled:bg-gray-400"
                  disabled={loading}
                >
                  {loading ? "Cancelling..." : "Cancel Booking"}
                </button>

            </div>
          ))}
        </div>
      </div>
    </div>
    </>
  );
};

export default MyProfile;
