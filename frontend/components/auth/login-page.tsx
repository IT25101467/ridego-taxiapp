"use client";
import { useState } from "react";

export default function LoginPage() {
  const [role, setRole] = useState("Customer");

  return (
    <div className="min-h-screen flex">

      {/* LEFT PANEL */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-100 items-center justify-center">
        <div className="flex flex-col items-center justify-center text-center space-y-10 animate-fadeIn">

          {/* CARD */}
          <div className="bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center gap-4 hover:scale-105 transition duration-500">

            {/* LOGO */}
            <img
              src="/logo.png"
              alt="RideGo Logo"
              className="w-32"
            />

            {/* BANNER */}
            <img
              src="/bg.jpg"
              alt="RideGo Banner"
              className="w-80 rounded-lg"
            />
          </div>

          {/* COPYRIGHT */}
          <p className="text-blue-600 font-semibold text-lg">
            © 2025 RideGo. All rights reserved.
          </p>

          {/* STATS */}
          <div className="flex gap-16 mt-4">
            {[
              { label: "Active Drivers", value: "200+" },
              { label: "Rides Today", value: "1.4k" },
              { label: "Avg. Rating", value: "4.8★" },
            ].map((stat, index) => (
              <div key={index} className="text-center hover:scale-110 transition">
                <p className="text-3xl font-bold text-blue-600">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-500">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex flex-1 items-center justify-center bg-gradient-to-br from-white to-blue-50 p-6">
        <div className="w-full max-w-md space-y-6 animate-slideUp">

          <h2 className="text-3xl font-bold text-center">
            Welcome back
          </h2>
          <p className="text-center text-gray-500">
            Sign in to your account to continue
          </p>

          {/* ROLE SELECT */}
          <div className="flex bg-gray-200 rounded-full p-1">
            {["Customer", "Driver", "Admin"].map((item) => (
              <button
                key={item}
                onClick={() => setRole(item)}
                className={`flex-1 py-2 text-sm rounded-full transition ${
                  role === item
                    ? "bg-white shadow font-medium"
                    : "text-gray-500"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          {/* FORM */}
          <div className="space-y-4">
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
            <input
              type="password"
              placeholder="password"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>

          {/* BUTTON */}
          <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300 hover:scale-105">
            Sign in
          </button>

          <p className="text-center text-sm">
            Don’t have an account?{" "}
            <span className="text-blue-600 cursor-pointer hover:underline">
              Create one
            </span>
          </p>

          {/* DEMO */}
          <div className="bg-gray-100 p-4 rounded-lg text-sm hover:shadow transition">
            <p className="font-semibold mb-2">DEMO ACCOUNTS</p>
            <p>Customer: sarah@example.com / password</p>
            <p>Driver: nimal@example.com / password</p>
            <p>Admin: admin@ridego.com / admin123</p>
          </div>

        </div>
      </div>

      {/* ANIMATIONS */}
      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 1s ease-in-out;
        }
        .animate-slideUp {
          animation: slideUp 0.8s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

    </div>
  );
}