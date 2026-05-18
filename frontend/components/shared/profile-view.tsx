"use client";

import { useState, useEffect } from "react";
import { useApp } from "@/lib/app-context";
import { API_BASE_URL } from "@/lib/config";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ProfileData {
  name: string;
  email: string;
  phone: string;
}

export default function ProfileView() {
  const { currentUser, updateProfile, deleteAccount } = useApp();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!currentUser?.id) return;

    async function loadProfile() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${API_BASE_URL}/users/${currentUser.id}`);
        const data = await res.json();
        if (data.error) {
          setError(data.error);
          return;
        }
        const loaded: ProfileData = {
          name: data.name ?? "",
          email: data.email ?? "",
          phone: data.phone ?? "",
        };
        setProfile(loaded);
        setName(loaded.name);
        setPhone(loaded.phone);
      } catch {
        setError("Could not load profile.");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [currentUser?.id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser?.id) return;

    setSaving(true);
    setMessage("");
    setError("");

    const payload: Record<string, string> = {};
    if (name.trim()) payload.name = name.trim();
    if (phone.trim()) payload.phone = phone.trim();
    if (newPassword) {
      if (!currentPassword) {
        setError("Enter your current password to set a new one.");
        setSaving(false);
        return;
      }
      payload.currentPassword = currentPassword;
      payload.newPassword = newPassword;
    }

    const result = await updateProfile(currentUser.id, payload);
    setSaving(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    setMessage("Profile updated successfully.");
    setProfile({
      name: result.name ?? name,
      email: result.email ?? profile?.email ?? "",
      phone: result.phone ?? phone,
    });
    setCurrentPassword("");
    setNewPassword("");
  };

  const handleDelete = async () => {
    if (!currentUser?.id) return;
    setDeleting(true);
    const ok = await deleteAccount(currentUser.id);
    setDeleting(false);
    if (!ok) {
      setError("Could not delete account. Please try again.");
    }
  };

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading profile...</p>;
  }

  return (
    <div className="flex flex-col gap-6 max-w-xl">
      <div>
        <h1 className="text-xl font-bold text-foreground">User Profile</h1>
        <p className="text-sm text-muted-foreground mt-0.5">View and update your account details</p>
      </div>

      {error && (
        <div className="p-3 bg-red-100 text-red-800 text-sm rounded-xl border border-red-200">
          {error}
        </div>
      )}
      {message && (
        <div className="p-3 bg-green-100 text-green-800 text-sm rounded-xl border border-green-200">
          {message}
        </div>
      )}

      <div className="bg-card border border-border rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4">Account Info</h3>
        <dl className="space-y-3 text-sm">
          <div>
            <dt className="text-muted-foreground">Username</dt>
            <dd className="font-medium text-foreground">{profile?.name}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Email</dt>
            <dd className="font-medium text-foreground">{profile?.email}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Phone Number</dt>
            <dd className="font-medium text-foreground">{profile?.phone || "—"}</dd>
          </div>
        </dl>
      </div>

      <form onSubmit={handleSave} className="bg-card border border-border rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-semibold text-foreground">Update Profile</h3>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Username</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Phone Number</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            required
          />
        </div>

        <div className="pt-2 border-t border-border space-y-4">
          <p className="text-sm font-medium text-foreground">Change Password (optional)</p>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>

      <div className="bg-card border border-destructive/30 rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-destructive mb-2">Danger Zone</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Deleting your account is permanent and cannot be undone.
        </p>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button
              type="button"
              className="px-4 py-2.5 rounded-xl border border-destructive text-destructive text-sm font-semibold hover:bg-destructive/10 transition"
            >
              Delete Account
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete your account?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently remove your account from RideGo. You will be logged out immediately.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={deleting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {deleting ? "Deleting..." : "Yes, delete my account"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
