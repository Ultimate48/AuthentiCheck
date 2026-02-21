import React, { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

function MemberDashboard() {
  const [batchId, setBatchId] = useState("");
  const [memberId, setMemberId] = useState("");
  const [shipToId, setShipToId] = useState("");
  const [status, setStatus] = useState("");

  const payload = {
    batchId,
    memberId,
    shipToId,
    status,
    time: new Date().toISOString(),
  };

  return (
    <div className="p-10 grid md:grid-cols-2 gap-8">
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Update Shipment</h2>

        <input
          className="input"
          placeholder="Batch ID"
          onChange={(e) => setBatchId(e.target.value)}
        />

        <input
          className="input"
          placeholder="Member ID"
          onChange={(e) => setMemberId(e.target.value)}
        />

        <input
          className="input"
          placeholder="Ship To ID"
          onChange={(e) => setShipToId(e.target.value)}
        />

        <textarea
          className="input"
          placeholder="Status"
          onChange={(e) => setStatus(e.target.value)}
        />
      </div>

      <div className="bg-white p-6 rounded shadow text-center">
        <h2 className="font-bold mb-4">QR Code</h2>
        <QRCodeCanvas value={JSON.stringify(payload)} />
      </div>
    </div>
  );
}

export default MemberDashboard;