"use client";

import { useApp } from "@/lib/app-context";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";


export default function ProfilePage() {

  const { currentUser } = useApp();

  const [isEditing, setIsEditing] = useState(false);

  const [name, setName] = useState(currentUser?.name || "");
  const [email, setEmail] = useState(currentUser?.email || "");
  const router = useRouter();

const handleLogout = () => {

  const handleSave = async () => {

  try {

    const response = await fetch(
      `http://localhost:8080/users/update/${currentUser?.id}`,
      {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          name,
          email,
        }),
      }
    );

    if (response.ok) {

      alert("Profile updated successfully!");

      setIsEditing(false);

    } else {

      alert("Update failed!");

    }

  } catch (error) {

    console.error(error);

    alert("Server error!");

  }

};

  alert("Logged out successfully!");

  router.push("/");

};
  const [profileImage, setProfileImage] = useState(
  "https://i.pravatar.cc/150"
);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 flex justify-center items-center p-6">
      <div className="bg-gradient-to-br from-blue-100 to-blue-300 w-full max-w-md rounded-2xl shadow-2xl p-6">

        {/* Profile Top */}
        <div className="flex flex-col items-center">

          <img
          src={profileImage}
            alt="profile"
            className="w-28 h-28 rounded-full border-4 border-blue-600"
          />
        <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg mt-4 inline-block">

  Upload Image

  <input
    type="file"
    className="hidden"
  />

</label>

          <h1 className="text-2xl font-bold mt-4">
            {currentUser?.name}
          </h1>

          <p className="text-gray-500">
            {currentUser?.email}
          </p>

        </div>

        {/* Details */}
        <div className="mt-6 space-y-4">

          <div className="bg-gray-100 p-4 rounded-xl">
            <p className="text-sm text-gray-500">
              Phone Number
            </p>

            <p className="font-bold">
              {currentUser?.phone}
            </p>
          </div>

          <div className="bg-gray-100 p-4 rounded-xl">
            <p className="text-sm text-gray-500">
              Email
            </p>

            <p className="font-bold">
              {currentUser?.email}
            </p>
          </div>

          <div className="bg-gray-100 p-4 rounded-xl">
            <p className="text-sm text-gray-500">
              Role
            </p>

            <p className="font-bold">
              Customer
            </p>
          </div>

        </div>

        {/* Buttons */}
        <div className="mt-6 space-y-3">

          <button
            onClick={() => setIsEditing(true)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg"
          >
            Edit Profile
          </button>

          <Link href="/history">

 <Link href="/history">

  <button className="w-full bg-gray-200 hover:bg-gray-300 py-3 rounded-lg">
    Ride History
  </button>

</Link>

</Link>

         <button
  onClick={handleLogout}
  className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg"
>
  Logout

</button>
        </div>

      </div>

      {/* Edit Modal */}
      {isEditing && (

        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">

          <div className="bg-white p-6 rounded-2xl w-96">

            <h2 className="text-2xl font-bold mb-4">
              Edit Profile
            </h2>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              className="w-full border p-3 rounded-lg mb-3"
            />

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full border p-3 rounded-lg mb-3"
            />

            <div className="flex gap-3">

              <button
                onClick={() => setIsEditing(false)}
                className="flex-1 bg-gray-300 py-3 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={() => setIsEditing(false)}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg"
              >
                Save
                
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}