import React, { useState } from "react";

function MemberDashboard() {
  const [batchId, setBatchId] = useState("");
  const [memberId, setMemberId] = useState("");
  const [shipToId, setShipToId] = useState("");
  const [status, setStatus] = useState("");

  const [qrImage, setQrImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      batchId,
      memberId,
      shipToId,
      status,
      time: new Date().toISOString(),
    };

    try {
      setLoading(true);

      const res = await fetch("place holder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      // API should return QR image URL or base64
      // Example: { qrImage: "data:image/png;base64,..." }
      setQrImage(data.qrImage);

    } catch (err) {
      console.error("QR fetch failed", err);
      alert("Failed to get QR from server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 grid md:grid-cols-2 gap-8">

      {/* ---------- FORM ---------- */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow space-y-4"
      >
        <h2 className="text-xl font-bold">Update Shipment</h2>

        <div>
          <label className="block font-semibold mb-1">Batch</label>
          <input
            className="w-full border p-2 rounded"
            value={batchId}
            onChange={(e) => setBatchId(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Member ID</label>
          <input
            className="w-full border p-2 rounded"
            value={memberId}
            onChange={(e) => setMemberId(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Ship To ID</label>
          <input
            className="w-full border p-2 rounded"
            value={shipToId}
            onChange={(e) => setShipToId(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Shipment Status</label>
          <textarea
            className="w-full border p-2 rounded h-24"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
          />
        </div>

        <button className="w-full bg-green-600 text-white p-2 rounded">
          {loading ? "Sending..." : "Submit & Fetch QR"}
        </button>
      </form>

      {/* ---------- QR DISPLAY ---------- */}
      <div className="bg-white p-6 rounded shadow text-center">
        <h2 className="font-bold mb-4">QR Code From Server</h2>

        {!qrImage && !loading && (
          <p className="text-gray-500">Submit form to receive QR</p>
        )}

        {loading && <p>Fetching QR from API...</p>}

        {qrImage && (
          <img
            src={qrImage}
            alt="QR Code"
            className="mx-auto w-56 h-56"
          />
        )}
      </div>

    </div>
  );
}

export default MemberDashboard;