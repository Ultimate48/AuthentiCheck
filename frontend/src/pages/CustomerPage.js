import React, { useState } from "react";

function CustomerPage() {
  const [data, setData] = useState(null);

  const scanQR = () => {
    setData({
      history: [
        { step: "Manufacturer", status: "Produced" },
        { step: "Distributor", status: "Shipped" },
        { step: "Retailer", status: "Delivered" },
      ],
    });
  };

  return (
    <div className="p-10">
      <button
        onClick={scanQR}
        className="bg-blue-600 text-white px-6 py-2 rounded"
      >
        Scan QR
      </button>

      {data &&
        data.history.map((item, i) => (
          <div key={i} className="border p-3 mt-3">
            {item.step} — {item.status}
          </div>
        ))}
    </div>
  );
}

export default CustomerPage;