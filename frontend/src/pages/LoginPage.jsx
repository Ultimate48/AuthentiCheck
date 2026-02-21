import { useState } from "react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    identity: "",
    password: "",
    remember: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form);

    // 👉 call login API here
  };

  return (
    <div className="min-h-screen bg-[#f5f6f8] flex flex-col items-center justify-center px-4 relative overflow-hidden">

      {/* grid background */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, #cbd5e1 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      />

      <div className="relative z-10 w-full max-w-md">

        {/* LOGO */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-blue-600 p-3 rounded-xl shadow-lg mb-4">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </div>

          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            AUTHENTICHECK
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Enterprise Security & Verification
          </p>
        </div>

        {/* CARD */}
        <div className="bg-white shadow-xl border rounded-xl p-8">

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Welcome back
            </h2>
            <p className="text-gray-500 mt-2">
              Enter your credentials to access the dashboard.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* USERNAME */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Username or Email
              </label>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  👤
                </span>

                <input
                  name="identity"
                  value={form.identity}
                  onChange={handleChange}
                  placeholder="e.g. logistics_manager@chaintrust.com"
                  className="w-full bg-gray-50 border rounded-lg py-3 pl-12 pr-4 focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  🔒
                </span>

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-gray-50 border rounded-lg py-3 pl-12 pr-12 focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  👁
                </button>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  name="remember"
                  checked={form.remember}
                  onChange={handleChange}
                />
                Remember me
              </label>

              <a href="#" className="text-sm text-blue-600 font-semibold">
                Forgot password?
              </a>
            </div>

            {/* LOGIN BUTTON */}
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg shadow-lg transition flex items-center justify-center gap-2">
              Login to Account →
            </button>
          </form>

          {/* SECURITY FOOTER */}
          <div className="mt-8 pt-6 border-t flex items-center justify-center gap-2 text-gray-400 text-xs">
            🔐 SECURE AES-256 ENCRYPTED CONNECTION
          </div>
        </div>

        {/* BOTTOM FOOTER */}
        <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-gray-500 text-sm">
          <div>© 2024 AUTHENTICHECK. All rights reserved.</div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-blue-600">Privacy Policy</a>
            <a href="#" className="hover:text-blue-600">Contact Support</a>
          </div>
        </div>

      </div>

      {/* background icon */}
      <div className="fixed bottom-0 right-0 opacity-10 text-[400px] text-blue-600 select-none">
        ⚙
      </div>

    </div>
  );
}