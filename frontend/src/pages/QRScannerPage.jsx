import React, { useState } from "react";

const QRScannerPage = () => {
  const [scanMode, setScanMode] = useState("scan");
  const [manualBatchId, setManualBatchId] = useState("");
  const [qrImage, setQrImage] = useState(null);

  const [form, setForm] = useState({
    name: "",
    quantity: "",
    info: "",
    destination: "",
    privateKey: "",
  });

  // ================================
  // HANDLE FORM CHANGE
  // ================================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ================================
  // LOAD BATCH USING MANUAL ENTRY
  // ================================
  const loadBatch = async () => {
    if (!manualBatchId) return alert("Enter Batch ID");

    try {
      // 🔹 Replace with real API
      const response = await fetch("API_PLACEHOLDER");

      // assume API returns QR image URL or base64
      const data = await response.json();

      setQrImage(data.qr);
      alert("Batch Loaded");
    } catch (err) {
      console.log(err);
      alert("Failed to load batch");
    }
  };

  // ================================
  // GENERATE SHIPPING (API QR)
  // ================================
  const generateShipping = async () => {
    try {
      const response = await fetch("API_PLACEHOLDER", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      setQrImage(data.qr);

      alert("Shipping QR received from API");
    } catch (err) {
      console.log(err);
      alert("Generation failed");
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">

      {/* HEADER */}
      <h1 className="text-3xl font-bold mb-6">Batch Processing</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* ===================================================== */}
        {/* LEFT PANEL — SCANNER */}
        {/* ===================================================== */}
        <div className="bg-white rounded-xl border p-6 shadow-sm">

          <h3 className="font-bold mb-4">Scan QR Code</h3>

          {/* TOGGLE */}
          <div className="flex mb-4 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setScanMode("scan")}
              className={`flex-1 py-2 rounded ${
                scanMode === "scan"
                  ? "bg-white shadow font-semibold"
                  : "text-gray-500"
              }`}
            >
              Scan QR
            </button>

            <button
              onClick={() => setScanMode("manual")}
              className={`flex-1 py-2 rounded ${
                scanMode === "manual"
                  ? "bg-white shadow font-semibold"
                  : "text-gray-500"
              }`}
            >
              Manual Entry
            </button>
          </div>

          {/* ================= CAMERA MODE ================= */}
          {scanMode === "scan" && (
            <div className="border-2 border-dashed h-64 flex flex-col items-center justify-center rounded-lg">
              <p className="text-gray-500 mb-3">
                Align QR code inside frame
              </p>

              <button className="bg-blue-600 text-white px-4 py-2 rounded shadow">
                Open Camera
              </button>
            </div>
          )}

          {/* ================= MANUAL MODE ================= */}
          {scanMode === "manual" && (
            <div className="space-y-3">
              <label className="text-sm font-semibold">
                Enter Batch ID
              </label>

              <input
                type="text"
                value={manualBatchId}
                onChange={(e) => setManualBatchId(e.target.value)}
                placeholder="Enter batch ID"
                className="w-full border p-3 rounded"
              />

              <button
                onClick={loadBatch}
                className="w-full bg-blue-600 text-white py-2 rounded shadow"
              >
                Load Batch
              </button>
            </div>
          )}

          {/* ================= QR FROM API ================= */}
          {qrImage && (
            <img
              src={qrImage}
              alt="QR"
              className="mt-6 w-44 mx-auto border p-2 rounded"
            />
          )}
        </div>

        {/* ===================================================== */}
        {/* RIGHT PANEL — FORM */}
        {/* ===================================================== */}
        <div className="bg-white rounded-xl border p-6 shadow-sm">

          <h3 className="font-bold mb-4">Batch Information</h3>

          <div className="grid grid-cols-2 gap-4">

            <input
              name="name"
              placeholder="Name"
              className="border p-3 rounded"
              onChange={handleChange}
            />

            <input
              name="quantity"
              placeholder="Quantity"
              className="border p-3 rounded"
              onChange={handleChange}
            />
          </div>

          <textarea
            name="info"
            placeholder="Additional info..."
            className="border p-3 rounded w-full mt-4"
            onChange={handleChange}
          />

          <input
            name="destination"
            placeholder="Shipping Destination ID"
            className="border p-3 rounded w-full mt-4"
            onChange={handleChange}
          />

          <input
            name="privateKey"
            placeholder="Private Key"
            className="border p-3 rounded w-full mt-4"
            onChange={handleChange}
          />

          {/* DIGI SIGN */}
          <button className="w-full mt-4 border rounded py-3 font-semibold">
            DIGI-SIGN
          </button>

          {/* GENERATE */}
          <button
            onClick={generateShipping}
            className="w-full mt-4 bg-blue-600 text-white py-3 rounded shadow-lg font-semibold"
          >
            GENERATE SHIPPING QR
          </button>
        </div>

      </div>

      {/* FOOTER STATS */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="bg-white border rounded p-4 text-center">
          <p className="text-sm text-gray-500">Batches Today</p>
          <p className="text-xl font-bold">24</p>
        </div>

        <div className="bg-white border rounded p-4 text-center">
          <p className="text-sm text-gray-500">Avg Process Time</p>
          <p className="text-xl font-bold">1.4m</p>
        </div>

        <div className="bg-white border rounded p-4 text-center">
          <p className="text-sm text-gray-500">System Status</p>
          <p className="text-xl font-bold text-green-600">Live</p>
        </div>
      </div>

    </div>
  );
};

export default QRScannerPage;