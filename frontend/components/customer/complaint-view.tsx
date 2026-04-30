"use client";

import { useState, useEffect } from "react";
import { useApp } from "@/lib/app-context";
import { API_BASE_URL } from "@/lib/config";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export interface Complaint {
  id: string;
  userId: string;
  title: string;
  description: string;
  status: string;
  adminResponse: string;
  createdAt: string;
}

export default function ComplaintView() {
  const { currentUser } = useApp();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);

  // Edit Modal States
  const [editingComplaint, setEditingComplaint] = useState<Complaint | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    if (currentUser?.id) {
      fetchComplaints();
    }
  }, [currentUser?.id]);

  const fetchComplaints = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/complaints/user/${currentUser?.id}`);
      if (res.ok) {
        const data = await res.json();
        setComplaints(data);
      }
    } catch (err) {
      console.error("Failed to fetch complaints", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !currentUser) return;

    try {
      // Create new complaint
      const res = await fetch(`${API_BASE_URL}/complaints`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser.id,
          title,
          description,
        }),
      });
      if (res.ok) {
        fetchComplaints();
        setTitle("");
        setDescription("");
      }
    } catch (err) {
      console.error("Failed to submit complaint", err);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTitle || !editDescription || !editingComplaint) return;

    try {
      const res = await fetch(`${API_BASE_URL}/complaints/${editingComplaint.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          title: editTitle, 
          description: editDescription 
        }),
      });
      if (res.ok) {
        fetchComplaints();
        setIsEditModalOpen(false);
        setEditingComplaint(null);
        setEditTitle("");
        setEditDescription("");
      }
    } catch (err) {
      console.error("Failed to update complaint", err);
    }
  };

  const handleEdit = (complaint: Complaint) => {
    if (complaint.status !== "OPEN") {
      alert("You can only edit OPEN complaints.");
      return;
    }
    setEditingComplaint(complaint);
    setEditTitle(complaint.title);
    setEditDescription(complaint.description);
    setIsEditModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">My Complaints</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Submit and track your issues</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="bg-card border border-border rounded-2xl p-6 h-fit">
          <h3 className="text-sm font-semibold text-foreground mb-5">
            File a New Complaint
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Brief summary of the issue"
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Please provide details..."
                rows={5}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:bg-primary/90 transition"
            >
              Submit Complaint
            </button>
          </form>
        </div>

        {/* List */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3">Complaint History</h3>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : complaints.length === 0 ? (
            <div className="bg-card border border-border rounded-2xl p-8 text-center">
              <p className="text-sm text-muted-foreground">You have no complaints on record.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {complaints.map((c) => (
                <div key={c.id} className="bg-card border border-border rounded-2xl p-5 flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold text-foreground">{c.title}</h4>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      c.status === 'OPEN' ? 'bg-yellow-100 text-yellow-800' :
                      c.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {c.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{c.description}</p>
                  
                  {c.adminResponse && (
                    <div className="bg-secondary/50 p-3 rounded-xl border border-border mt-1">
                      <p className="text-xs font-semibold text-foreground mb-1">Support Response:</p>
                      <p className="text-sm text-foreground">{c.adminResponse}</p>
                    </div>
                  )}

                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-muted-foreground">{new Date(c.createdAt).toLocaleDateString()}</span>
                    {c.status === "OPEN" && (
                      <button 
                        onClick={() => handleEdit(c)}
                        className="text-xs font-medium text-primary hover:underline"
                      >
                        Edit
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none bg-background rounded-2xl">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="text-xl font-bold">Edit Complaint</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdate}>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Title</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-muted/30 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Description</label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-muted/30 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                  required
                />
              </div>
            </div>
            <DialogFooter className="p-6 pt-0 flex gap-3">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="flex-1 py-2.5 bg-secondary text-secondary-foreground rounded-xl font-semibold text-sm hover:bg-secondary/80 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-[2] py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:bg-primary/90 transition shadow-lg shadow-primary/20"
              >
                Update Complaint
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
