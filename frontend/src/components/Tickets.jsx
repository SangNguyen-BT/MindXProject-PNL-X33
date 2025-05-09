import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { backendUrl } from "../App";
import ProfileNav from "./ProfileNav";
import { Responsive } from "./Responsive";
import { useNavigate } from "react-router-dom";

const MyProfile = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getBookings = async () => {
    setLoading(true);
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

      if (response.data.ok && Array.isArray(response.data.data)) {
        const validBookings = response.data.data.filter(
          (booking) => booking !== null
        );
        setBookings(validBookings);
      } else {
        setBookings([]);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setBookings([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    getBookings();
  }, []);

  const cancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure to delete this booking?")) return;

    setLoading(true);
    try {
      const response = await axios.delete(
        `${backendUrl}/api/movie/removebooking/${bookingId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.message === "Ticket cancelled successfully") {
        toast.success("Ticket cancelled successfully!");
        setBookings(bookings.filter((booking) => booking._id !== bookingId));
      }
    } catch (error) {
      console.error("Error deleting booking:", error);
      toast.error("❌ Error deleting booking!");
    } finally {
      setLoading(false);
    }
  };

  // Hàm xử lý khi click vào thẻ vé
  const handleViewTicketDetails = (bookingId) => {
    navigate(`/ticket-info?bookingId=${bookingId}`);
  };

  return (
    <>
      <ProfileNav />
      <div
        className="max-w-2xl mx-auto p-5 flex flex-col gap-5 items-center"
        responsive={Responsive}
      >
        <div className="mt-5 w-full flex flex-col items-center justify-center">
          <h2 className="text-3xl font-semibold text-white mt-10">
            Booking Detail
          </h2>
          <div className="flex flex-wrap gap-2.5 w-full justify-center">
            {loading ? (
              <p className="text-white mt-5">Loading...</p>
            ) : bookings.length === 0 ? (
              <p className="text-white mt-5">No data.</p>
            ) : (
              bookings.map((booking) => {
                return (
                  <div
                    className="my-5 border border-gray-300 rounded p-4 cursor-pointer hover:bg-gray-800 transition-all"
                    key={booking._id}
                  >
                    <div className="flex items-center mb-2.5">
                      <h3 className="mr-2.5 text-red-100 font-normal">Movie</h3>
                      <p className="m-0 text-yellow-300">
                        {booking.movieTitle}
                      </p>
                    </div>
                    <div className="flex items-center mb-2.5">
                      <h3 className="mr-2.5 text-red-100 font-normal">
                        Cinema
                      </h3>
                      <p className="m-0 text-yellow-300">
                        {booking.screenName}
                      </p>
                    </div>
                    <div className="flex items-center mb-2.5">
                      <h3 className="mr-2.5 text-red-100 font-normal">
                        Location
                      </h3>
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
                      <h3 className="mr-2.5 text-red-100 font-normal">
                        Price Paid
                      </h3>
                      <p className="m-0 text-yellow-300">
                        {new Intl.NumberFormat("vi-VN").format(
                          booking.totalPrice
                        )}{" "}
                        VND
                      </p>
                    </div>
                    <div className="flex items-center mb-2.5">
                      <h3 className="mr-2.5 text-red-100 font-normal">
                        Show Date
                      </h3>
                      <p className="m-0 text-yellow-300">
                        {new Date(booking.showDate).toLocaleDateString(
                          "en-US",
                          {
                            weekday: "long",
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </p>
                    </div>
                    <div className="flex items-center mb-2.5">
                      <h3 className="mr-2.5 text-red-100 font-normal">
                        Show Time
                      </h3>
                      <p className="m-0 text-yellow-300">{booking.showTime}</p>
                    </div>

                    {/* Nút Cancel Booking */}
                    <div className="flex justify-between gap-5">
                      <button
                        onClick={() => cancelBooking(booking._id)}
                        className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition disabled:bg-gray-400"
                        disabled={loading}
                      >
                        {loading ? "Cancelling..." : "Cancel Booking"}
                      </button>

                      <button
                        onClick={() => handleViewTicketDetails(booking._id)}
                        className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:bg-gray-400"
                      >
                        Get QR code
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MyProfile;
