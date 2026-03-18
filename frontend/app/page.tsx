"use client";

import { useState } from "react";
import { AppProvider, useApp } from "@/lib/app-context";
import LoginPage from "@/components/auth/login-page";
import SignupPage from "@/components/auth/signup-page";
import CustomerDashboard from "@/components/customer/customer-dashboard";
import DriverDashboard from "@/components/driver/driver-dashboard";
import AdminDashboard from "@/components/admin/admin-dashboard";

function AppRouter() {
  const { currentUser } = useApp();
  const [authPage, setAuthPage] = useState<"login" | "signup">("login");

  if (!currentUser) {
    if (authPage === "signup") {
      return <SignupPage onNavigate={(page) => setAuthPage(page as "login" | "signup")} />;
    }
    return <LoginPage onNavigate={(page) => setAuthPage(page as "login" | "signup")} />;
  }

  if (currentUser.role === "customer") return <CustomerDashboard />;
  if (currentUser.role === "driver") return <DriverDashboard />;
  if (currentUser.role === "admin") return <AdminDashboard />;

  return null;
}

export default function Page() {
  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  );
}
