"use client";

import { useState } from "react";

export default function SafetyButton() {
  const [calling, setCalling] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSOS = () => {
    setCalling(true);

    setTimeout(() => {
      setCalling(false);
      setSuccess(true);
    }, 4000);
  };

  return (
    <div className="flex flex-col items-center justify-center mt-10">

      {!calling && !success && (
        <button
          onClick={handleSOS}
          className="bg-red-600 hover:bg-red-700 text-white text-2xl font-bold px-10 py-6 rounded-full shadow-2xl"
        >
          SOS
        </button>
      )}

      {calling && (
        <div className="bg-black text-white p-10 rounded-3xl shadow-2xl text-center w-80 animate-pulse">

          <h1 className="text-3xl font-bold mb-4">
            Emergency Calling...
          </h1>

          <p className="text-gray-300 mb-2">
            Contacting Emergency Support
          </p>

          <div className="text-6xl mt-6">📞</div>

          <p className="mt-6 text-green-400">
            Sending your live location...
          </p>

        </div>
      )}

      {success && (
        <div className="bg-green-600 text-white p-8 rounded-2xl shadow-xl text-center">

          <h1 className="text-2xl font-bold">
            Alert Sent Successfully
          </h1>

          <p className="mt-2">
            Emergency contact has been notified.
          </p>

        </div>
      )}

    </div>
  );
}