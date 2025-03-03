import React, { useEffect, useState } from "react";
import axios from "axios";

import { backendUrl } from "../App";

const ListBooking = () => {
  const [bookings, setBookings] = useState([]);

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
      <table className="w-full border-collapse border border-gray-400">
        <thead>
          <tr>
            <th className="border border-gray-400 px-4 py-2">No.</th>
            <th className="border border-gray-400 px-4 py-2">User Name</th>
            <th className="border border-gray-400 px-4 py-2">Email</th>
            <th className="border border-gray-400 px-4 py-2">Movie</th>
            <th className="border border-gray-400 px-4 py-2">Cinema</th>
            <th className="border border-gray-400 px-4 py-2">Seats</th>
            <th className="border border-gray-400 px-4 py-2">Total Price</th>
            <th className="border border-gray-400 px-4 py-2">Show Date</th>
            <th className="border border-gray-400 px-4 py-2">Show Time</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking, index) => (
            <tr key={booking._id}>
              <td className="border border-gray-400 px-4 py-2">{index + 1}</td>
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
                ${booking.totalPrice}
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
    </div>
  );
};

export default ListBooking;
