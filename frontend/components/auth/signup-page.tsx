"use client";

import { useState } from "react";
import { useApp } from "@/lib/app-context"; // 1. Import the hook

interface SignupPageProps {
  onNavigate: (page: string) => void;
}

export default function SignupPage({ onNavigate }: SignupPageProps) {
  const { register } = useApp(); // 2. Grab the register function
  const [role, setRole] = useState<"customer" | "driver">("customer");
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(""); // 3. Add an error state
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    // Validation: Check if passwords match
    if (form.password !== form.confirm) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);

    // 4. Call the real Java registration!
    const success = await register({
      name: form.name,
      email: form.email,
      phone: form.phone,
      password: form.password,
      role: role
    });

    setLoading(false);

    if (success) {
      setSubmitted(true);
    } else {
      setError("Registration failed. Email might already be in use.");
    }
  }

  // ... (Keep the "if (submitted)" block and the rest of the UI the same)
  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-foreground">Account created!</h2>
          <p className="text-muted-foreground mt-2 leading-relaxed">
            Your {role} account has been registered. You can now sign in.
          </p>
          <button
            onClick={() => onNavigate("login")}
            className="mt-6 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

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
            Join thousands<br />of happy riders.
          </h1>
          <p className="mt-4 text-primary-foreground/70 leading-relaxed text-lg">
            Create your account in seconds and start booking rides instantly.
          </p>
          <ul className="mt-8 space-y-3">
            {["No booking fees", "Real-time tracking", "Safe & verified drivers", "24/7 support"].map((item) => (
              <li key={item} className="flex items-center gap-3 text-primary-foreground/80">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-accent flex-shrink-0">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-primary-foreground/40 text-sm">© 2025 RideGo. All rights reserved.</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3" />
                <rect x="9" y="11" width="14" height="10" rx="2" />
              </svg>
            </div>
            <span className="text-lg font-bold text-foreground">RideGo</span>
          </div>

          <h2 className="text-2xl font-bold text-foreground">Create your account</h2>
          <p className="text-muted-foreground mt-1 leading-relaxed">Join us as a customer or driver</p>

          {/* Role selector */}
          <div className="mt-6 flex gap-2 p-1 bg-muted rounded-xl">
            {(["customer", "driver"] as const).map((opt) => (
              <button
                key={opt}
                onClick={() => setRole(opt)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                  role === opt
                    ? "bg-card text-primary shadow-sm border border-border"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Full name</label>
              <input name="name" type="text" value={form.name} onChange={handleChange} placeholder="John Doe" required
                className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Email address</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required
                className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Phone number</label>
              <input name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="+94 77 000 0000" required
                className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
                <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="••••••••" required
                  className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Confirm</label>
                <input name="confirm" type="password" value={form.confirm} onChange={handleChange} placeholder="••••••••" required
                  className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition" />
              </div>
            </div>

            <button type="submit"
              className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition mt-2">
              Create Account
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <button onClick={() => onNavigate("login")} className="text-primary font-medium hover:underline">
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
