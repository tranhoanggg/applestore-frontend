import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import FilmDetail from "./FilmDetail";
import FilmSchedule from "./FilmSchedule";
import SeatSelection from "./SeatSelection";
import GoodsPayment from "./GoodsPayment";
import "./BookTicket.css";

function BookTicket() {
  const location = useLocation();
  const { filmId } = location.state || {}; // filmId được truyền khi nhấn "Mua vé ngay"

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);

  // Callback nhận từ FilmSchedule
  const handleScheduleSelect = (date, time) => {
    setSelectedDate(date);
    setSelectedTime(time);
  };

  const handleSeatSelection = (room, seats) => {
    setSelectedRoom(room);
    setSelectedSeats(seats);
  };

  return (
    <div className="bookticket-container">
      {/* 🔹 Phần hiển thị thông tin phim */}
      {filmId ? (
        <div className="bookticket-film-section">
          <FilmDetail filmId={filmId} />
        </div>
      ) : (
        <p className="bookticket-warning">
          ⚠️ Không tìm thấy thông tin phim. Vui lòng quay lại trang trước.
        </p>
      )}

      {/* 🔹 Phần giữa gồm lịch chiếu (trái) và chọn ghế (phải) */}
      <div className="bookticket-middle-wrapper">
        <div className="bookticket-middle">
          <div className="left-column">
            <FilmSchedule
              filmId={filmId}
              onSelectSchedule={handleScheduleSelect}
            />
          </div>
          <div className="right-column">
            <SeatSelection
              key={`${filmId}-${selectedDate}-${selectedTime}`}
              filmId={filmId}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              onSeatSelect={handleSeatSelection}
            />
          </div>
        </div>
      </div>

      {/* 🔹 Phần tiếp theo (GoodsPayment) */}
      <div className="bookticket-goods-section">
        <GoodsPayment
          filmId={filmId}
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          selectedRoom={selectedRoom}
          selectedSeats={selectedSeats}
        />
      </div>
    </div>
  );
}

export default BookTicket;
