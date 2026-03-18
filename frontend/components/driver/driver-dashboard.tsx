"use client";

import { useState } from "react";
import Sidebar from "@/components/shared/sidebar";
import ActiveJobsView from "./active-jobs-view";
import DriverHistoryView from "./driver-history-view";

function BriefcaseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
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

const navItems = [
  { id: "active-jobs", label: "Active Jobs", icon: <BriefcaseIcon /> },
  { id: "history", label: "Trip History", icon: <ListIcon /> },
];

export default function DriverDashboard() {
  const [activeView, setActiveView] = useState("active-jobs");

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar
        navItems={navItems}
        activeView={activeView}
        onViewChange={setActiveView}
        title="Driver"
      />
      <main className="flex-1 lg:ml-0 pt-16 lg:pt-0">
        <div className="p-6 max-w-4xl mx-auto">
          {activeView === "active-jobs" && <ActiveJobsView />}
          {activeView === "history" && <DriverHistoryView />}
        </div>
      </main>
    </div>
  );
}
