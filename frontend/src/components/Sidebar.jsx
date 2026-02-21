import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-64 bg-white shadow-lg p-6">

      <h2 className="text-xl font-bold mb-6">
        AUTHENTICHECK
      </h2>

      <nav className="space-y-4">

        <Link to="/scanner" className="block hover:text-blue-600">
          QR Scanner
        </Link>

        <Link to="/admin" className="block hover:text-blue-600">
          Batch Management
        </Link>

        <Link to="/track" className="block hover:text-blue-600">
          Track Product
        </Link>

      </nav>
    </div>
  );
}