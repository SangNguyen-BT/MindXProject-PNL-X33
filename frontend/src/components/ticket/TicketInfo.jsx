import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import axios from "axios";

import { backendUrl } from "../../App";

const TicketInfo = () => {
  const [ticketData, setTicketData] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchTicketData = async () => {
      try {
        const bookingId = new URLSearchParams(location.search).get("bookingId");
        if (!bookingId) {
          navigate("/");
          return;
        }

        const response = await axios.get(
          `${backendUrl}/api/movie/booking/${bookingId}`
        );
        console.log("Response:", response.data);

        if (response.data.ok) {
          setTicketData(response.data.data);
        } else {
          throw new Error("Không thể lấy thông tin vé");
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin vé:", error);
        setError(error.message);
      }
    };

    fetchTicketData();
  }, [location, navigate]);

  if (error) {
    return <div className="text-white text-center">Lỗi: {error}</div>;
  }

  if (!ticketData) {
    return (
      <div className="text-white text-center">Đang tải thông tin vé...</div>
    );
  }

  // Tạo chuỗi dữ liệu cho QR code
  const qrData = JSON.stringify({
    bookingId: ticketData._id,
    movieTitle: ticketData.movieTitle,
    screenName: ticketData.screenName,
    showTime: ticketData.showTime,
    showDate: ticketData.showDate,
    seats: ticketData.seats.map((seat) => seat.seat_id).join(", "),
  });

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="p-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Thông Tin Vé
          </h2>

          {/* QR Code */}
          <div className="flex justify-center mb-6">
            <QRCodeSVG
              value={qrData}
              size={200}
              level="H"
              includeMargin={true}
              className="border-4 border-gray-200 rounded-lg"
            />
          </div>

          {/* Thông tin vé */}
          <div className="space-y-4">
            <div className="border-b pb-4">
              <h3 className="text-xl font-semibold text-gray-800">
                {ticketData.movieTitle}
              </h3>
              <p className="text-gray-600">Rạp: {ticketData.screenName}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Ngày chiếu:</p>
                <p className="font-semibold">
                  {new Date(ticketData.showDate).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Giờ chiếu:</p>
                <p className="font-semibold">{ticketData.showTime}</p>
              </div>
            </div>

            <div>
              <p className="text-gray-600">Ghế:</p>
              <p className="font-semibold">
                {ticketData.seats.map((seat) => seat.seat_id).join(", ")}
              </p>
            </div>

            <div className="border-t pt-4">
              <p className="text-gray-600">Tổng tiền:</p>
              <p className="text-2xl font-bold text-gray-800">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(ticketData.totalPrice)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketInfo;
