"use client";

import { useState } from "react";
import { useApp } from "@/lib/app-context";
import Link from "next/link";

interface LoginPageProps {
  onNavigate: (page: string) => void;
}

export default function LoginPage({ onNavigate }: LoginPageProps) {
  const { login } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"customer" | "driver" | "admin">("customer");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    // We add 'await' here so React pauses until Java gives us a True or False answer!
    const success = await login(email, password, role); 
    
    setLoading(false);
    
    if (!success) {
      setError("Invalid credentials. Please check your email and password.");
    }
  }

  const roleOptions = [
    { value: "customer", label: "Customer" },
    { value: "driver", label: "Driver" },
    { value: "admin", label: "Admin" },
  ] as const;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary flex-col justify-between p-12">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3" />
              <rect x="9" y="11" width="14" height="10" rx="2" />
              <circle cx="12" cy="17" r="1" />
              <circle cx="20" cy="17" r="1" />
            </svg>
          </div>
          <span className="text-xl font-bold text-primary-foreground tracking-tight">RideGo</span>
        </div>
        <div>
          <h1 className="text-4xl font-bold text-primary-foreground leading-tight text-balance">
            Your ride,<br />your way.
          </h1>
          <p className="mt-4 text-primary-foreground/70 leading-relaxed text-lg">
            Fast, safe, and reliable taxi booking across the city. Get where you need to go in minutes.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-4">
            {[
              { label: "Active Drivers", value: "200+" },
              { label: "Rides Today", value: "1.4k" },
              { label: "Avg. Rating", value: "4.8★" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/10 rounded-xl p-4">
                <p className="text-2xl font-bold text-accent">{stat.value}</p>
                <p className="text-sm text-primary-foreground/60 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="text-primary-foreground/40 text-sm">© 2025 RideGo. All rights reserved.</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3" />
                <rect x="9" y="11" width="14" height="10" rx="2" />
                <circle cx="12" cy="17" r="1" />
                <circle cx="20" cy="17" r="1" />
              </svg>
            </div>
            <span className="text-lg font-bold text-foreground">RideGo</span>
          </div>

          <h2 className="text-2xl font-bold text-foreground">Welcome back</h2>
          <p className="text-muted-foreground mt-1 leading-relaxed">Sign in to your account to continue</p>

          {/* Role selector */}
          <div className="mt-6 flex gap-2 p-1 bg-muted rounded-xl">
            {roleOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setRole(opt.value)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                  role === opt.value
                    ? "bg-card text-primary shadow-sm border border-border"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={role === "admin" ? "admin@ridego.com" : "you@example.com"}
                required
                className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-sm leading-relaxed">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition disabled:opacity-60 mt-2"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <button
              onClick={() => onNavigate("signup")}
              className="text-primary font-medium hover:underline"
            >
              Create one
            </button>
          </p>

          {/* Demo hints */}
          <div className="mt-6 p-4 bg-muted rounded-xl">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Demo accounts</p>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p><span className="font-medium text-foreground">Customer:</span> sarah@example.com / password</p>
              <p><span className="font-medium text-foreground">Driver:</span> nimal@example.com / password</p>
              <p><span className="font-medium text-foreground">Admin:</span> admin@ridego.com / admin123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
