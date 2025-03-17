import React from 'react'
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const MovieTicketChart = ({bookings}) => {

    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

    const ticketByMovie = bookings.reduce((acc, booking) => {
        acc[booking.movieTitle] = (acc[booking.movieTitle] || 0) + booking.seats.length;
        return acc;
      }, {});
    
      const chartData = Object.entries(ticketByMovie).map(([movie, count]) => ({
        name: movie,
        value: count,
      }));
    
  return (
    <div className="w-full h-64">
      <h3 className="text-lg font-bold mb-2">Tickets Sold by Movie</h3>
      <PieChart width={500} height={300}>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
          label
        >
          {chartData.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend layout="vertical" align="right" verticalAlign="middle"/>
      </PieChart>
    </div>
  )
}

export default MovieTicketChart