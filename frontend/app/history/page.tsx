"use client";

export default function HistoryPage() {

  const rides = [
    {
      id: 1,
      from: "Colombo",
      to: "Kandy",
      date: "2026-05-10",
      price: "Rs. 4500",
    },
    {
      id: 2,
      from: "Negombo",
      to: "Airport",
      date: "2026-05-12",
      price: "Rs. 1800",
    },
    {
      id: 3,
      from: "Galle",
      to: "Matara",
      date: "2026-05-13",
      price: "Rs. 2200",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <h1 className="text-3xl font-bold mb-6">
        Ride History
      </h1>

      <div className="space-y-4">

        {rides.map((ride) => (

          <div
            key={ride.id}
            className="bg-white p-5 rounded-2xl shadow"
          >

            <div className="flex justify-between items-center">

              <div>
                <h2 className="text-xl font-bold">
                  {ride.from} → {ride.to}
                </h2>

                <p className="text-gray-500">
                  {ride.date}
                </p>
              </div>

              <div className="text-blue-600 font-bold text-lg">
                {ride.price}
              </div>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}