import { useState } from "react";

export default function AdminPage() {

  const [form, setForm] = useState({
    batchId: "",
    memberId: "",
    shipToId: "",
    status: ""
  });

  const [qrImage, setQrImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");



  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };



  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setQrImage(null);

    try {
      const res = await fetch("API_PLACEHOLDER_URL", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      // API should return QR image URL
      setQrImage(data.qrImage);
      setMessage("Batch submitted successfully ✔");

    } catch (err) {
      setMessage("Something went wrong ❌");
      console.error(err);
    }

    setLoading(false);
  };



  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <div className="max-w-4xl mx-auto">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Supply Chain Batch Management
          </h1>
          <p className="text-gray-500">
            Create shipment batch and receive QR from server
          </p>
        </div>


        {/* FORM CARD */}
        <div className="bg-white rounded-2xl shadow-lg p-8">

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* BATCH ID */}
            <div>
              <label className="block font-medium mb-2">
                Batch ID
              </label>
              <input
                type="text"
                name="batchId"
                value={form.batchId}
                onChange={handleChange}
                placeholder="Enter batch ID"
                className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>


            {/* MEMBER ID */}
            <div>
              <label className="block font-medium mb-2">
                Member ID
              </label>
              <input
                type="text"
                name="memberId"
                value={form.memberId}
                onChange={handleChange}
                placeholder="Supplier / Retailer ID"
                className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>


            {/* SHIP TO ID */}
            <div>
              <label className="block font-medium mb-2">
                Ship To ID
              </label>
              <input
                type="text"
                name="shipToId"
                value={form.shipToId}
                onChange={handleChange}
                placeholder="Receiver ID"
                className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>


            {/* STATUS */}
            <div>
              <label className="block font-medium mb-2">
                Shipment Status
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select status</option>
                <option value="Created">Created</option>
                <option value="Dispatched">Dispatched</option>
                <option value="In Transit">In Transit</option>
                <option value="Delivered">Delivered</option>
                <option value="Accepted">Accepted</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>


            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              {loading ? "Submitting..." : "Submit Batch"}
            </button>

          </form>


          {/* MESSAGE */}
          {message && (
            <p className="mt-4 text-center font-medium text-green-600">
              {message}
            </p>
          )}


          {/* QR RESULT */}
          {qrImage && (
            <div className="mt-8 text-center">
              <h3 className="font-semibold mb-4 text-lg">
                QR Received from API
              </h3>

              <img
                src={qrImage}
                alt="QR Code"
                className="mx-auto w-48 h-48 border rounded-lg shadow"
              />
            </div>
          )}

        </div>

      </div>

    </div>
  );
}