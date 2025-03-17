import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const UserBookingChart = ({ bookings }) => {

    const userBookings = {};

    bookings.forEach((booking) => {
      if (booking.userId) {
        const key = `${booking.userId.name} (${booking.userId.email})`; 
        userBookings[key] = (userBookings[key] || 0) + booking.seats.length; 
      }
    });

    const chartData = Object.entries(userBookings).map(([user, tickets]) => ({
        user,
        tickets,
      }));

  return (
    <div className="w-full h-64">
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} layout="vertical">
            <XAxis type="number" />
            <YAxis dataKey="user" type="category" width={200} />
            <Tooltip />
            <Bar dataKey="tickets" fill="#4F46E5" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-center text-gray-500">No bookings available</p>
      )}
    </div>
  );
};

export default UserBookingChart;
