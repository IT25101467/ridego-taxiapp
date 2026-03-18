"use client";

import { useState } from "react";
import { useApp } from "@/lib/app-context";
import { Driver } from "@/lib/mock-data";

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface SidebarProps {
  navItems: NavItem[];
  activeView: string;
  onViewChange: (view: string) => void;
  title: string;
  subtitle?: string;
}

function CarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3" />
      <rect x="9" y="11" width="14" height="10" rx="2" />
      <circle cx="12" cy="17" r="1" />
      <circle cx="20" cy="17" r="1" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

export default function Sidebar({ navItems, activeView, onViewChange, title, subtitle }: SidebarProps) {
  const { currentUser, logout, toggleDriverAvailability } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isDriver = currentUser?.role === "driver";
  const driver = isDriver ? (currentUser as Driver) : null;

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
            <CarIcon />
          </div>
          <div>
            <span className="text-base font-bold text-foreground">RideGo</span>
            <p className="text-xs text-muted-foreground capitalize">{currentUser?.role} Portal</p>
          </div>
        </div>
      </div>

      {/* Driver availability toggle */}
      {isDriver && driver && (
        <div className="px-4 py-3 mx-4 mt-4 rounded-xl bg-muted">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-foreground">Status</p>
              <p className={`text-xs font-medium ${driver.available ? "text-green-600" : "text-muted-foreground"}`}>
                {driver.available ? "Available" : "Offline"}
              </p>
            </div>
            <button
              onClick={() => toggleDriverAvailability(driver.id)}
              className={`relative w-11 h-6 rounded-full transition-colors ${driver.available ? "bg-green-500" : "bg-border"}`}
              aria-label="Toggle availability"
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${driver.available ? "translate-x-5" : "translate-x-0"}`} />
            </button>
          </div>
        </div>
      )}

      {/* Nav items */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => { onViewChange(item.id); setMobileOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeView === item.id
                ? "bg-sidebar-accent text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <span className={activeView === item.id ? "text-primary" : "text-muted-foreground"}>
              {item.icon}
            </span>
            {item.label}
          </button>
        ))}
      </nav>

      {/* User footer */}
      <div className="px-3 py-4 border-t border-border">
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-muted transition group">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-semibold text-primary">
              {currentUser?.name?.charAt(0) ?? "U"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{currentUser?.name}</p>
            <p className="text-xs text-muted-foreground truncate">{currentUser?.email}</p>
          </div>
          <button
            onClick={logout}
            className="text-muted-foreground hover:text-destructive transition"
            title="Logout"
          >
            <LogoutIcon />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-card border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <CarIcon />
          </div>
          <span className="font-bold text-foreground">RideGo</span>
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 text-muted-foreground hover:text-foreground transition"
          aria-label="Open menu"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/30" onClick={() => setMobileOpen(false)} />
          <div className="relative w-72 bg-card h-full shadow-xl">
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 flex-col bg-card border-r border-border h-screen sticky top-0">
        <SidebarContent />
      </aside>
    </>
  );
}
