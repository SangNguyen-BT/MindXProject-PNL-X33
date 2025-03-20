import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const RevenueChart = ({ bookings }) => {

  const revenueByDate = bookings.reduce((acc, booking) => {
    const date = new Date(booking.showDate).toLocaleDateString("en-US");
    acc[date] = (acc[date] || 0) + booking.totalPrice;
    return acc;
  }, {});

  const chartData = Object.entries(revenueByDate).map(([date, total]) => ({
    date,
    revenue: total,
  }));

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <XAxis dataKey="date" />
          <YAxis tickFormatter={(value) => `${new Intl.NumberFormat('vi-VN').format(value)} VND`}/>
          <Tooltip formatter={(value) => `${new Intl.NumberFormat('vi-VN').format(value)} VND`}/>
          <Bar dataKey="revenue" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueChart;
