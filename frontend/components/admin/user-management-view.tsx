"use client";

import { useState } from "react";
import { useApp } from "@/lib/app-context";
import { User, Driver } from "@/lib/mock-data";

// ─── Icons ────────────────────────────────────────────────────────────────────

function EditIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

// ─── User Modal ───────────────────────────────────────────────────────────────

interface UserModalProps {
  mode: "add" | "edit";
  type: "customer" | "driver";
  initial?: any;
  onClose: () => void;
  onSave: (data: any) => void;
}

function UserModal({ mode, type, initial, onClose, onSave }: UserModalProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [email, setEmail] = useState(initial?.email ?? "");
  const [phone, setPhone] = useState(initial?.phone ?? "");
  const [password, setPassword] = useState(initial?.password ?? "password");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email || !phone) return;
    onSave({
      name,
      email,
      phone,
      password,
      role: type,
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/20 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <h2 className="text-base font-semibold text-foreground">
              {mode === "add" ? `Add New ${type}` : `Edit ${type}`}
            </h2>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition p-1 rounded-lg hover:bg-muted">
            <XIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase">Full Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase">Phone</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} required className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm" />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-border rounded-xl text-sm font-medium">Cancel</button>
            <button type="submit" className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90">
              {mode === "add" ? "Add" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Delete Confirm ───────────────────────────────────────────────────────────

function DeleteConfirm({ name, onConfirm, onCancel }: { name: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/20 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-2xl shadow-xl w-full max-w-sm p-6 text-center space-y-4">
        <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center mx-auto text-red-600">
          <TrashIcon />
        </div>
        <div>
          <p className="text-base font-semibold text-foreground">Delete {name}?</p>
          <p className="text-sm text-muted-foreground mt-1">This will permanently remove them from the system.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2.5 border border-border rounded-xl text-sm font-medium">Cancel</button>
          <button onClick={onConfirm} className="flex-1 py-2.5 bg-destructive text-destructive-foreground rounded-xl text-sm font-semibold hover:opacity-90">Delete</button>
        </div>
      </div>
    </div>
  );
}

// ─── Main View ────────────────────────────────────────────────────────────────

export default function UserManagementView() {
  const { customers, drivers, register, deleteCustomer, deleteDriver, updateCustomer, updateDriver } = useApp();

  type ModalState =
    | { open: false }
    | { open: true; mode: "add" | "edit"; type: "customer" | "driver"; item?: User | Driver };

  type DeleteState = { open: false } | { open: true; type: "customer" | "driver"; id: string; name: string };

  const [modal, setModal] = useState<ModalState>({ open: false });
  const [deleteState, setDeleteState] = useState<DeleteState>({ open: false });

  // REAL PERSISTENT SAVE
  async function handleSaveCustomer(data: any) {
    if (modal.open && modal.mode === "edit" && modal.item) {
      updateCustomer(modal.item.id, data);
    } else {
      await register({ ...data, role: "customer" });
    }
    setModal({ open: false });
  }

  async function handleSaveDriver(data: any) {
    if (modal.open && modal.mode === "edit" && modal.item) {
      updateDriver(modal.item.id, data);
    } else {
      await register({ ...data, role: "driver" });
    }
    setModal({ open: false });
  }

  // REAL PERSISTENT DELETE
  async function confirmDelete() {
    if (!deleteState.open) return;
    if (deleteState.type === "customer") await deleteCustomer(deleteState.id);
    else await deleteDriver(deleteState.id);
    setDeleteState({ open: false });
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-xl font-bold text-foreground">User Management</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Manage all registered customers and drivers from Java database</p>
      </div>

      {/* Customers Section */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">
            Customers <span className="ml-2 text-muted-foreground">({customers.length})</span>
          </h2>
          <button onClick={() => setModal({ open: true, mode: "add", type: "customer" })} className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-semibold">
            <PlusIcon /> Add Customer
          </button>
        </div>
        <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">NAME</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">EMAIL</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-muted-foreground">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {customers.map((user) => (
                <tr key={user.id} className="hover:bg-muted/30">
                  <td className="px-5 py-4 font-medium">{user.name}</td>
                  <td className="px-5 py-4 text-muted-foreground">{user.email}</td>
                  <td className="px-5 py-4 text-right">
                    <button onClick={() => setDeleteState({ open: true, type: "customer", id: user.id, name: user.name })} className="p-2 text-muted-foreground hover:text-destructive">
                      <TrashIcon />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Drivers Section */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">
            Drivers <span className="ml-2 text-muted-foreground">({drivers.length})</span>
          </h2>
          <button onClick={() => setModal({ open: true, mode: "add", type: "driver" })} className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-semibold">
            <PlusIcon /> Add Driver
          </button>
        </div>
        <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">NAME</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">RATING</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">STATUS</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-muted-foreground">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {drivers.map((driver) => (
                <tr key={driver.id} className="hover:bg-muted/30">
                  <td className="px-5 py-4 font-medium">{driver.name}</td>
                  <td className="px-5 py-4">{driver.rating?.toFixed(1) ?? "5.0"} ⭐</td>
                  <td className="px-5 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${driver.available ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"}`}>
                      {driver.available ? "Online" : "Offline"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button onClick={() => setDeleteState({ open: true, type: "driver", id: driver.id, name: driver.name })} className="p-2 text-muted-foreground hover:text-destructive">
                      <TrashIcon />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Modals Container */}
      {modal.open && (
        <UserModal
          mode={modal.mode}
          type={modal.type}
          initial={modal.item}
          onClose={() => setModal({ open: false })}
          onSave={modal.type === "customer" ? handleSaveCustomer : handleSaveDriver}
        />
      )}
      
      {deleteState.open && (
        <DeleteConfirm
          name={deleteState.name}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteState({ open: false })}
        />
      )}
    </div>
  );
}