"use client";

import { useState } from "react";
import Sidebar from "@/components/shared/sidebar";
import BookingView from "./booking-view";
import MyTripsView from "./my-trips-view";
import HistoryView from "./history-view";
import ReviewView from "./review-view";

function MapPinIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
function ClockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
function ListIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  );
}
function StarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

const navItems = [
  { id: "booking", label: "Book a Ride", icon: <MapPinIcon /> },
  { id: "my-trips", label: "My Trips", icon: <ClockIcon /> },
  { id: "history", label: "History", icon: <ListIcon /> },
  { id: "review", label: "Review", icon: <StarIcon /> },
];

export default function CustomerDashboard() {
  const [activeView, setActiveView] = useState("booking");

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar
        navItems={navItems}
        activeView={activeView}
        onViewChange={setActiveView}
        title="Customer"
      />
      <main className="flex-1 lg:ml-0 pt-16 lg:pt-0">
        <div className="p-6 max-w-5xl mx-auto">
          {activeView === "booking" && <BookingView onRideRequested={() => setActiveView("my-trips")} />}
          {activeView === "my-trips" && <MyTripsView />}
          {activeView === "history" && <HistoryView />}
          {activeView === "review" && <ReviewView />}
        </div>
      </main>
    </div>
  );
}
