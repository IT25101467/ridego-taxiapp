"use client";

import { useState } from "react";
import Sidebar from "@/components/shared/sidebar";
import AllBookingsView from "./all-bookings-view";
import UserManagementView from "./user-management-view";

function BookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}
function UsersIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

const navItems = [
  { id: "bookings", label: "All Bookings", icon: <BookIcon /> },
  { id: "users", label: "User Management", icon: <UsersIcon /> },
];

export default function AdminDashboard() {
  const [activeView, setActiveView] = useState("bookings");

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar
        navItems={navItems}
        activeView={activeView}
        onViewChange={setActiveView}
        title="Admin"
      />
      <main className="flex-1 lg:ml-0 pt-16 lg:pt-0">
        <div className="p-6 max-w-6xl mx-auto">
          {activeView === "bookings" && <AllBookingsView />}
          {activeView === "users" && <UserManagementView />}
        </div>
      </main>
    </div>
  );
}
