import React, { useEffect, useState } from "react";
import "./FilmDetail.css";

function FilmDetail({ filmId }) {
  const [film, setFilm] = useState(null);

  useEffect(() => {
    if (!filmId) return; // Không có ID thì bỏ qua
    fetch(`http://localhost:5000/films/${filmId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Network error");
        return res.json();
      })
      .then((data) => setFilm(data))
      .catch((err) => console.error("Lỗi fetch film:", err));
  }, [filmId]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [film]);

  if (!film) return <div className="film-loading">Đang tải...</div>;

  const classifyText =
    film.classify === 0
      ? "Phim phù hợp với mọi độ tuổi"
      : `Phim phổ biến đến người xem từ ${film.classify} tuổi trở lên`;

  return (
    <section className="filmdetail-overlay">
      <div className="filmdetail-container">
        <div className="filmdetail-left">
          <img
            src={require(`../../assets/images/Film/${film.ID}.jpg`)}
            alt={film.name}
            className="filmdetail-poster"
            onError={(e) => (e.target.style.display = "none")}
          />
        </div>

        <div className="filmdetail-right">
          <h1 className="filmdetail-title">{film.name}</h1>
          <p className="filmdetail-description">{film.description}</p>

          <div className="filmdetail-info">
            <p>
              <strong>Phân loại:</strong>{" "}
              <span className="highlight">{classifyText}</span>
            </p>
            <p>
              <strong>Định dạng:</strong> {film.format}
            </p>
            <p>
              <strong>Đạo diễn:</strong> {film.director}
            </p>
            <p>
              <strong>Diễn viên:</strong> {film.actor}
            </p>
            <p>
              <strong>Thể loại:</strong> {film.type}
            </p>
            <p>
              <strong>Khởi chiếu:</strong> {film.start_day}
            </p>
            <p>
              <strong>Thời lượng:</strong> {film.duration} phút
            </p>
            <p>
              <strong>Giá vé:</strong> 50.000 VNĐ
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FilmDetail;
