import { useState } from "react";

export default function AdminPage() {

  // =============================
  // MEMBER MANAGEMENT (demo data)
  // =============================
  const [members, setMembers] = useState([
    { id: "SUP001", name: "GreenWay Logistics", status: "Pending" },
    { id: "RET101", name: "EcoStore Retail", status: "Approved" },
    { id: "MAN555", name: "CleanFab Textiles", status: "Pending" }
  ]);

  const updateStatus = (id, newStatus) => {
    setMembers(members.map(m =>
      m.id === id ? { ...m, status: newStatus } : m
    ));
  };



  // =============================
  // BATCH FORM
  // =============================
  const [form, setForm] = useState({
    batchId: "",
    memberId: "",
    shipToId: "",
    status: ""
  });

  const [qrImage, setQrImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };



  // =============================
  // SUBMIT TO BACKEND
  // =============================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    setQrImage(null);

    try {
      const res = await fetch("API_PLACEHOLDER_URL", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      setQrImage(data.qrImage);
      setMsg("Batch processed successfully ✅");

    } catch (err) {
      setMsg("Failed to process batch ❌");
    }

    setLoading(false);
  };



  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <div className="max-w-7xl mx-auto space-y-8">

        {/* ================= HEADER ================= */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Admin Control Panel</h1>
          <div className="text-gray-500">Supply Chain Governance</div>
        </div>



        {/* ================= MEMBER MANAGEMENT ================= */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-4">
            Supply Chain Members
          </h2>

          <table className="w-full text-left">
            <thead className="border-b">
              <tr>
                <th className="py-2">Member ID</th>
                <th>Name</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {members.map(member => (
                <tr key={member.id} className="border-b">
                  <td className="py-3 font-medium">{member.id}</td>
                  <td>{member.name}</td>
                  <td>
                    <span className={`
                      px-3 py-1 rounded-full text-sm
                      ${member.status === "Approved" ? "bg-green-100 text-green-700" : ""}
                      ${member.status === "Pending" ? "bg-yellow-100 text-yellow-700" : ""}
                      ${member.status === "Suspended" ? "bg-red-100 text-red-700" : ""}
                    `}>
                      {member.status}
                    </span>
                  </td>

                  <td className="space-x-2">
                    <button
                      onClick={() => updateStatus(member.id, "Approved")}
                      className="bg-green-500 text-white px-3 py-1 rounded"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() => updateStatus(member.id, "Suspended")}
                      className="bg-yellow-500 text-white px-3 py-1 rounded"
                    >
                      Suspend
                    </button>

                    <button
                      onClick={() =>
                        setMembers(members.filter(m => m.id !== member.id))
                      }
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>



        {/* ================= BATCH CREATION ================= */}
        <div className="bg-white p-6 rounded-2xl shadow">

          <h2 className="text-xl font-semibold mb-4">
            Create Shipment Batch
          </h2>

          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">

            <input
              name="batchId"
              placeholder="Batch ID"
              className="border p-3 rounded-lg"
              onChange={handleChange}
              required
            />

            <input
              name="memberId"
              placeholder="Member ID"
              className="border p-3 rounded-lg"
              onChange={handleChange}
              required
            />

            <input
              name="shipToId"
              placeholder="Ship To ID"
              className="border p-3 rounded-lg"
              onChange={handleChange}
              required
            />

            <select
              name="status"
              className="border p-3 rounded-lg"
              onChange={handleChange}
              required
            >
              <option value="">Select Status</option>
              <option>Created</option>
              <option>Dispatched</option>
              <option>In Transit</option>
              <option>Delivered</option>
            </select>

            <button
              className="col-span-2 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? "Processing..." : "Submit Batch"}
            </button>
          </form>

          {msg && <p className="mt-4 font-medium">{msg}</p>}

          {qrImage && (
            <div className="mt-6 text-center">
              <h3 className="font-semibold mb-2">QR From Server</h3>
              <img src={qrImage} className="w-40 mx-auto" />
            </div>
          )}

        </div>

      </div>

    </div>
  );
}