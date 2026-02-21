import React from "react";

function AdminPanel() {
  const members = [
    { id: "SUP1", name: "Supplier A" },
    { id: "RET2", name: "Retailer B" },
  ];

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>

      {members.map((m) => (
        <div key={m.id} className="flex justify-between border p-3 mb-2">
          {m.name}
          <div className="space-x-2">
            <button className="bg-green-600 text-white px-3 py-1 rounded">
              Approve
            </button>
            <button className="bg-red-600 text-white px-3 py-1 rounded">
              Remove
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AdminPanel;