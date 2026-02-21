import React from "react";

export default function ProductTrackingPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">

      {/* ================= HEADER ================= */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
              ✓
            </div>
            <span className="text-xl font-bold">AUTHENTICHECK</span>
          </div>

          <nav className="hidden md:flex gap-8 text-sm font-medium">
            <a className="hover:text-blue-600">How it works</a>
            <a className="hover:text-blue-600">Sustainability Reports</a>
            <a className="hover:text-blue-600">Certifications</a>
          </nav>

        </div>
      </header>


      {/* ================= HERO ================= */}
      <section className="text-center py-12 px-4">
        <h1 className="text-4xl font-bold mb-3">
          Track Your Product's Journey
        </h1>

        <p className="text-gray-500 max-w-xl mx-auto">
          Scan the product QR code to see the full story behind your purchase,
          from farm to storefront.
        </p>


        {/* SCAN CARD */}
        <div className="mt-8 inline-block bg-white rounded-2xl shadow-lg p-6">
          <button className="bg-blue-600 hover:bg-blue-700 transition text-white font-semibold px-16 py-6 rounded-xl shadow-md">
            📷 SCAN QR CODE
          </button>

          <p className="text-xs text-gray-400 mt-3">
            Place the product QR code within the frame to begin
          </p>
        </div>
      </section>


      {/* ================= PRODUCT CARD ================= */}
      <section className="max-w-6xl mx-auto px-6">

        <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col md:flex-row gap-6">

          <img
            src="https://via.placeholder.com/200"
            className="rounded-xl w-full md:w-48"
          />

          <div className="flex-1">

            <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">
              In Store & Verified
            </span>

            <h2 className="text-2xl font-bold mt-2">
              Premium Organic Cotton T-Shirt
            </h2>

            <p className="text-gray-500 text-sm mt-1">
              Batch #882910 • GOTS Certified Organic
            </p>


            {/* STATS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-5 text-sm">
              <div>
                <p className="text-gray-400">Carbon Footprint</p>
                <p className="font-semibold">2.4kg CO2e</p>
              </div>

              <div>
                <p className="text-gray-400">Water Saved</p>
                <p className="font-semibold">2,100 Liters</p>
              </div>

              <div>
                <p className="text-gray-400">Fair Wages</p>
                <p className="font-semibold text-green-600">Verified ✓</p>
              </div>

              <div>
                <p className="text-gray-400">Origin</p>
                <p className="font-semibold">Gujarat, India</p>
              </div>
            </div>
          </div>

        </div>
      </section>



      {/* ================= SUPPLY CHAIN ================= */}
      <section className="max-w-6xl mx-auto px-6 mt-10">

        <h3 className="text-xl font-bold mb-6">
          The Supply Chain Journey
        </h3>


        <div className="space-y-6">

          <TimelineCard
            title="EcoStore Retail Flagship"
            status="Accepted by Retailer"
            desc="Inventory received and inspected. Quality standards met."
          />

          <TimelineCard
            title="GreenWay Logistics"
            status="Shipment Delivered"
            desc="Shipment delivered to distribution hub."
          />

          <TimelineCard
            title="CleanFab Textiles Ltd."
            status="Production Complete"
            desc="Fabric manufactured and batch tested."
          />

          <TimelineCard
            title="Bharat Organic Farms"
            status="Harvest & Raw Material Prep"
            desc="Organic cotton harvested using sustainable farming."
          />

        </div>

      </section>



      {/* ================= BLOCKCHAIN ================= */}
      <section className="max-w-6xl mx-auto px-6 mt-10 mb-16">

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 shadow-sm">

          <h3 className="text-xl font-bold">
            Verified by Blockchain
          </h3>

          <p className="text-gray-600 mt-2 max-w-2xl">
            Every step in this journey is cryptographically signed and stored
            on a public ledger. Data cannot be altered ensuring full transparency.
          </p>

          <button className="mt-6 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition">
            View on Block Explorer
          </button>

        </div>

      </section>



      {/* ================= FOOTER ================= */}
      <footer className="bg-white border-t py-10 text-center text-gray-500 text-sm">
        © 2025 AUTHENTICHECK — Transparency Portal
      </footer>

    </div>
  );
}



/* ================= REUSABLE TIMELINE CARD ================= */

function TimelineCard({ title, status, desc }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border">

      <h4 className="font-semibold">{title}</h4>

      <p className="text-sm text-blue-600 mt-1">
        Status: {status}
      </p>

      <p className="text-gray-500 text-sm mt-3">
        {desc}
      </p>

    </div>
  );
}