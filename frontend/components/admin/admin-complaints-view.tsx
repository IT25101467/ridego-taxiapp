"use client";

import { useState, useEffect } from "react";
import { API_BASE_URL } from "@/lib/config";
import { Complaint } from "../customer/complaint-view";

export default function AdminComplaintsView() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [response, setResponse] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/complaints`);
      if (res.ok) {
        const data = await res.json();
        // Sort newest first
        setComplaints(data.sort((a: Complaint, b: Complaint) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      }
    } catch (err) {
      console.error("Failed to fetch complaints", err);
    } finally {
      setLoading(false);
    }
  };

  const openRespondModal = (c: Complaint) => {
    setSelectedComplaint(c);
    setResponse(c.adminResponse || "");
    setStatus(c.status);
  };

  const handleRespond = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint) return;

    try {
      const res = await fetch(`${API_BASE_URL}/complaints/${selectedComplaint.id}/respond`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminResponse: response,
          status: status,
        }),
      });
      if (res.ok) {
        fetchComplaints();
        setSelectedComplaint(null);
      }
    } catch (err) {
      console.error("Failed to submit response", err);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-foreground">Manage Complaints</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Review and respond to customer issues</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-secondary/50 text-muted-foreground font-medium border-b border-border">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">User ID</th>
                <th className="px-6 py-4">Issue</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">Loading complaints...</td>
                </tr>
              ) : complaints.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">No complaints found.</td>
                </tr>
              ) : (
                complaints.map((c) => (
                  <tr key={c.id} className="hover:bg-secondary/20 transition">
                    <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-foreground">{c.userId}</td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground">{c.title}</div>
                      <div className="text-muted-foreground text-xs line-clamp-1 mt-0.5">{c.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        c.status === 'OPEN' ? 'bg-yellow-100 text-yellow-800' :
                        c.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => openRespondModal(c)}
                        className="text-primary hover:text-primary/80 font-medium text-sm transition"
                      >
                        Respond
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Respond Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl w-full max-w-lg shadow-xl border border-border">
            <div className="p-6 border-b border-border">
              <h2 className="text-lg font-bold text-foreground">Respond to Complaint</h2>
              <p className="text-sm text-muted-foreground mt-1">From User: {selectedComplaint.userId}</p>
            </div>
            
            <form onSubmit={handleRespond} className="p-6 space-y-5">
              <div className="bg-secondary/30 p-4 rounded-xl border border-border">
                <h4 className="font-semibold text-sm mb-1">{selectedComplaint.title}</h4>
                <p className="text-sm text-muted-foreground">{selectedComplaint.description}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Update Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <option value="OPEN">Open</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="RESOLVED">Resolved</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Admin Response</label>
                <textarea
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  placeholder="Type your response to the customer..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                  required
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:bg-primary/90 transition"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedComplaint(null)}
                  className="px-4 py-2.5 bg-secondary text-secondary-foreground rounded-xl font-semibold text-sm hover:bg-secondary/80 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
