import React from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from "recharts";

const CinemaTicketChart = ({bookings}) => {

    const processTicketsByCinema = (bookings) => {
        const cinemaData = {};
      
        bookings.forEach((booking) => {
          const cinema = booking.screenName; // Tên rạp
          const seatCount = booking.seats.length; // Số ghế đã đặt
      
          if (cinemaData[cinema]) {
            cinemaData[cinema] += seatCount;
          } else {
            cinemaData[cinema] = seatCount;
          }
        });
      
        // Convert object to array for Recharts
        return Object.keys(cinemaData).map((cinema) => ({
          cinema,
          tickets: cinemaData[cinema],
        }));
      };

    const chartData = processTicketsByCinema(bookings);

  return (
    <div className="w-full h-64">
      <h3 className="text-lg font-bold mb-4 text-center">Tickets Sold by Cinema</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" allowDecimals={false} />
          <YAxis dataKey="cinema" type="category" width={100} />
          <Tooltip />
          <Legend />
          <Bar dataKey="tickets" fill="#82ca9d" name="Tickets Sold" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default CinemaTicketChart