import React, { useEffect, useState } from "react";
import axios from "axios";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";

import { backendUrl } from "../App";
import RevenueChart from "../components/RevenueChart";
import MovieTicketChart from "../components/MovieTicketChart";
import CinemaTicketChart from "../components/CinemaTicketChart";
import UserBookingChart from "../components/UserBookingChart";

const ListBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedCinema, setSelectedCinema] = useState("");

  const [showCharts, setShowCharts] = useState({
    revenue: false,
    movieTickets: false,
    cinemaTickets: false,
    userBookings: false,
  });

  const toggleChart = (chart) => {
    setShowCharts((prev) => ({ ...prev, [chart]: !prev[chart] }));
  };

  const filteredBookings = selectedCinema
    ? bookings.filter((booking) => booking.screenName === selectedCinema)
    : bookings;

  const fetchBookings = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/movie/getbookings`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data.ok) {
        setBookings(response.data.data);
      } else {
        console.error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error.message);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div className="p-5">
      <h2 className="text-xl font-bold mb-5">Bookings Management</h2>

      {bookings.length === 0 ? (
        <div className="text-center text-gray-500 text-lg">
          No bookings available.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5 mb-12">
          <div className="border p-3 rounded-lg shadow">
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => toggleChart("revenue")}
      >
        <h3 className="font-bold text-lg">Revenue Chart By Date</h3>
        {showCharts.revenue ? (
          <ChevronUpIcon className="w-5 h-5" />
        ) : (
          <ChevronDownIcon className="w-5 h-5" />
        )}
      </div>
      {showCharts.revenue && (
        <div className="overflow-x-auto min-w-[300px]">
          <RevenueChart bookings={bookings} />
        </div>
      )}
    </div>

    <div className="border p-3 rounded-lg shadow">
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => toggleChart("movieTickets")}
      >
        <h3 className="font-bold text-lg">Movie Ticket Chart</h3>
        {showCharts.movieTickets ? (
          <ChevronUpIcon className="w-5 h-5" />
        ) : (
          <ChevronDownIcon className="w-5 h-5" />
        )}
      </div>
      {showCharts.movieTickets && (
        <div className="min-h-[300px]">
          <MovieTicketChart bookings={bookings} />
        </div>
      )}
    </div>


    <div className="border p-3 rounded-lg shadow mb-5">
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => toggleChart("cinemaTickets")}
      >
        <h3 className="font-bold text-lg">Cinema Chart</h3>
        {showCharts.cinemaTickets ? (
          <ChevronUpIcon className="w-5 h-5" />
        ) : (
          <ChevronDownIcon className="w-5 h-5" />
        )}
      </div>
      {showCharts.cinemaTickets && (
        <div className="min-h-[300px]">
          <CinemaTicketChart bookings={bookings} />
        </div>
      )}
    </div>

    <div className="border p-3 rounded-lg shadow">
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => toggleChart("userBookings")}
      >
        <h3 className="font-bold text-lg">User Booking Statistics</h3>
        {showCharts.userBookings ? (
          <ChevronUpIcon className="w-5 h-5" />
        ) : (
          <ChevronDownIcon className="w-5 h-5" />
        )}
      </div>
      {showCharts.userBookings && (
        <div className="min-h-[300px]">
          <UserBookingChart bookings={bookings} />
        </div>
      )}
    </div>
          </div>

          <div className="flex justify-between items-center mb-4 mt-20">
            <h3 className="text-lg font-bold">Filter by Cinema</h3>
            <select
              className="border border-gray-400 px-3 py-1 rounded"
              value={selectedCinema}
              onChange={(e) => setSelectedCinema(e.target.value)}
            >
              <option value="">All Cinemas</option>
              {Array.from(new Set(bookings.map((b) => b.screenName))).map(
                (cinema) => (
                  <option key={cinema} value={cinema}>
                    {cinema}
                  </option>
                )
              )}
            </select>
          </div>

          <table className="w-full border-collapse border border-gray-400">
            <thead>
              <tr>
                <th className="border border-gray-400 px-4 py-2">No.</th>
                <th className="border border-gray-400 px-4 py-2">User Name</th>
                <th className="border border-gray-400 px-4 py-2">Email</th>
                <th className="border border-gray-400 px-4 py-2">Movie</th>
                <th className="border border-gray-400 px-4 py-2">Cinema</th>
                <th className="border border-gray-400 px-4 py-2">Seats</th>
                <th className="border border-gray-400 px-4 py-2">
                  Total Price
                </th>
                <th className="border border-gray-400 px-4 py-2">Show Date</th>
                <th className="border border-gray-400 px-4 py-2">Show Time</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking, index) => (
                <tr key={booking._id}>
                  <td className="border border-gray-400 px-4 py-2">
                    {index + 1}
                  </td>
                  <td className="border border-gray-400 px-4 py-2">
                    {booking.userId?.name}
                  </td>
                  <td className="border border-gray-400 px-4 py-2">
                    {booking.userId?.email}
                  </td>
                  <td className="border border-gray-400 px-4 py-2">
                    {booking.movieTitle}
                  </td>
                  <td className="border border-gray-400 px-4 py-2">
                    {booking.screenName}
                  </td>
                  <td className="border border-gray-400 px-4 py-2">
                    {booking.seats.map((seat) => seat.seat_id).join(", ")}
                  </td>
                  <td className="border border-gray-400 px-4 py-2">
                    VND{booking.totalPrice}
                  </td>
                  <td className="border border-gray-400 px-4 py-2">
                    {new Date(booking.showDate).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td className="border border-gray-400 px-4 py-2">
                    {booking.showTime}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default ListBooking;
