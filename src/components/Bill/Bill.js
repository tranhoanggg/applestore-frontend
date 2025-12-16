import React, { useEffect, useState } from "react";
import "./Bill.css";

const Bill = () => {
  const client = JSON.parse(localStorage.getItem("client"));
  const [bills, setBills] = useState([]);
  const [expandedBill, setExpandedBill] = useState(null);
  const [billDetails, setBillDetails] = useState({});
  const [cancelingId, setCancelingId] = useState(null);

  const loadBills = async () => {
    const res = await fetch(`http://localhost:5000/bill/${client.id}`);
    const data = await res.json();
    setBills(data);
  };

  useEffect(() => {
    if (!client) return;

    loadBills();
  }, [client]);

  // group bill theo ngày
  const billsByDate = bills.reduce((acc, bill) => {
    const date = new Date(bill.date).toLocaleDateString("vi-VN");
    if (!acc[date]) acc[date] = [];
    acc[date].push(bill);
    return acc;
  }, {});

  const toggleDetail = async (billId) => {
    if (expandedBill === billId) {
      setExpandedBill(null);
      return;
    }

    if (!billDetails[billId]) {
      const res = await fetch(`http://localhost:5000/bill-full/${billId}`);
      const data = await res.json();

      setBillDetails((prev) => ({
        ...prev,
        [billId]: data.items,
      }));
    }

    setExpandedBill(billId);
  };

  const renderStatus = (status) =>
    status === "Thành công"
      ? "Giao dịch thành công"
      : status === "Đã huỷ"
      ? "Đã huỷ"
      : "Đang chờ thanh toán";

  const renderPayment = (method, bank) =>
    method === "Tiền mặt"
      ? "Thanh toán tại quầy"
      : `Chuyển khoản qua ngân hàng ${bank}`;

  const cancelBill = async (billId) => {
    const ok = window.confirm("Bạn có chắc chắn muốn huỷ đơn hàng này?");
    if (!ok) return;

    try {
      setCancelingId(billId);

      const res = await fetch(`http://localhost:5000/bill/cancel/${billId}`, {
        method: "PUT",
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Huỷ đơn thất bại");
        return;
      }

      // Nếu đang mở chi tiết → đóng lại
      if (expandedBill === billId) {
        setExpandedBill(null);
      }

      // Reload danh sách bill để cập nhật trạng thái
      await loadBills();
    } catch (err) {
      console.error(err);
      alert("Có lỗi xảy ra khi huỷ đơn");
    } finally {
      setCancelingId(null);
    }
  };

  return (
    <section className="bill-container">
      <h1 className="bill-title">Đơn hàng của {client.name}</h1>

      {Object.entries(billsByDate).map(([date, list]) => (
        <div key={date} className="bill-day">
          <h2 className="bill-date">{date}</h2>

          {list.map((bill) => (
            <div className="bill-card" key={bill.id}>
              <div className="bill-summary">
                <div>
                  <p>
                    <b>Người nhận:</b> {bill.name}
                  </p>
                  <p>
                    <b>Số điện thoại:</b>{" "}
                    {expandedBill === bill.id ? bill.phone : "********"}
                  </p>
                  <p>
                    <b>Phương thức:</b>{" "}
                    {renderPayment(bill.payment_method, bill.bank)}
                  </p>
                  <p>
                    <b>Tình trạng:</b> {renderStatus(bill.payment_status)}
                  </p>
                </div>

                <div className="bill-actions">
                  <button onClick={() => toggleDetail(bill.id)}>
                    Thông tin chi tiết
                  </button>

                  {/* ĐANG CHỜ THANH TOÁN → HUỶ */}
                  {bill.payment_status === "Đang chờ thanh toán" && (
                    <button
                      className="danger"
                      onClick={() => cancelBill(bill.id)}
                      disabled={cancelingId === bill.id}
                    >
                      {cancelingId === bill.id ? "Đang huỷ..." : "Huỷ đơn"}
                    </button>
                  )}

                  {/* ĐÃ HUỶ → MUA LẠI (DISABLED) */}
                  {bill.payment_status === "Đã huỷ" && (
                    <div className="tooltip-wrapper">
                      <button className="buy-again" disabled>
                        Mua lại
                      </button>
                      <span className="tooltip">
                        Chức năng này hiện chưa hỗ trợ.
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* DETAIL */}
              {expandedBill === bill.id && billDetails[bill.id] && (
                <div className="bill-items-container">
                  {billDetails[bill.id].map((item, idx) => {
                    const { product, quantity, type } = item;

                    if (!product) return null;

                    return (
                      <div className="bill-item" key={idx}>
                        <img
                          className="bill-img"
                          src={`/assets/images/${type}/${product.name
                            .toLowerCase()
                            .replace(/\s+/g, "")}/${product.image}/1.png`}
                          alt={product.name}
                        />

                        <div className="bill-info">
                          <h3>{product.name}</h3>
                          <p>Màu sắc: {product.color}</p>

                          {(type === "Iphone" || type === "Ipad") && (
                            <p>Dung lượng: {product.capacity}</p>
                          )}

                          {type === "Mac" && (
                            <p>
                              RAM: {product.ram} – ROM: {product.rom}
                            </p>
                          )}
                        </div>

                        <div className="bill-quantity">
                          <span>{quantity}</span>
                        </div>

                        <div className="bill-price">
                          {(product.price * quantity).toLocaleString()}đ
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </section>
  );
};

export default Bill;
