"use client";

import { Download, Edit3, Plus, RotateCcw, Save, ShieldAlert, Trash2, UserCog, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useSuperAdminData, type AdminUser, type AdminUserInput } from "@/components/superadmin/SuperAdminProvider";

const emptyForm: AdminUserInput = {
  name: "",
  email: "",
  role: "Business Owner",
  status: "Active",
  lastSeen: "Now",
  businesses: 0,
  reviews: 0
};

const roles: AdminUser["role"][] = ["Business Owner", "Reviewer", "Editor", "Super Admin"];
const statuses: AdminUser["status"][] = ["Active", "Watchlist", "Suspended"];

export default function SuperAdminUsersPage() {
  const {
    users,
    addUser,
    updateUser,
    deleteUser,
    suspendUser,
    restoreUser,
    suspendWatchlistUsers,
    restoreAllUsers,
    recordAudit
  } = useSuperAdminData();
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<AdminUserInput>(emptyForm);

  const filtered = useMemo(() => {
    const needle = query.toLowerCase().trim();

    return users.filter((user) => {
      const matchesQuery =
        !needle || [user.name, user.email, user.role, user.status].join(" ").toLowerCase().includes(needle);
      const matchesRole = role === "all" || user.role === role;
      return matchesQuery && matchesRole;
    });
  }, [query, role, users]);

  const userStats = useMemo(
    () => ({
      total: users.length,
      active: users.filter((user) => user.status === "Active").length,
      suspended: users.filter((user) => user.status === "Suspended").length,
      admins: users.filter((user) => user.role === "Super Admin" || user.role === "Editor").length
    }),
    [users]
  );

  function updateField<Key extends keyof AdminUserInput>(key: Key, value: AdminUserInput[Key]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function startEdit(user: AdminUser) {
    setEditingId(user.id);
    setForm({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      lastSeen: user.lastSeen,
      businesses: user.businesses,
      reviews: user.reviews
    });
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
  }

  function saveUser() {
    const normalized: AdminUserInput = {
      ...form,
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      businesses: Number.isFinite(form.businesses) ? form.businesses : 0,
      reviews: Number.isFinite(form.reviews) ? form.reviews : 0
    };

    if (!normalized.name || !normalized.email) return;

    if (editingId) {
      updateUser(editingId, normalized);
    } else {
      addUser(normalized);
    }

    resetForm();
  }

  function exportUsers() {
    recordAudit("Exported user report", `${filtered.length} users`, "Super admin exported the currently filtered user list.", "Info");
  }

  return (
    <>
      <div className="superadmin-heading">
        <div>
          <span>User governance</span>
          <h1>Users, owners and editors</h1>
          <p>Super admin can add, edit, update, suspend, restore, delete and save every user account from one control panel.</p>
        </div>
      </div>

      <section className="superadmin-metrics">
        <article>
          <UserCog size={20} aria-hidden />
          <span>Total users</span>
          <strong>{userStats.total}</strong>
          <small>Managed in super admin</small>
        </article>
        <article>
          <RotateCcw size={20} aria-hidden />
          <span>Active</span>
          <strong>{userStats.active}</strong>
          <small>Can access assigned tools</small>
        </article>
        <article>
          <ShieldAlert size={20} aria-hidden />
          <span>Suspended</span>
          <strong>{userStats.suspended}</strong>
          <small>Blocked from activity</small>
        </article>
        <article>
          <Edit3 size={20} aria-hidden />
          <span>Privileged</span>
          <strong>{userStats.admins}</strong>
          <small>Editors and super admins</small>
        </article>
      </section>

      <section className="superadmin-panel">
        <div className="superadmin-panel__head">
          <h2>Bulk user tools</h2>
          <span>Moderate and export account groups</span>
        </div>
        <div className="superadmin-actions">
          <button data-danger onClick={suspendWatchlistUsers} type="button">
            <ShieldAlert size={14} aria-hidden />
            Suspend watchlist
          </button>
          <button onClick={restoreAllUsers} type="button">
            <RotateCcw size={14} aria-hidden />
            Restore all users
          </button>
          <button onClick={exportUsers} type="button">
            <Download size={14} aria-hidden />
            Export filtered
          </button>
        </div>
      </section>

      <section className="superadmin-panel">
        <div className="superadmin-panel__head">
          <h2>{editingId ? "Edit user" : "Add new user"}</h2>
          <span>{editingId ? "Update and save account details" : "Create a user with any role"}</span>
        </div>
        <div className="superadmin-user-form">
          <label>
            Name
            <input value={form.name} onChange={(event) => updateField("name", event.target.value)} placeholder="Full name" />
          </label>
          <label>
            Email
            <input value={form.email} onChange={(event) => updateField("email", event.target.value)} placeholder="user@example.com" />
          </label>
          <label>
            Role
            <select value={form.role} onChange={(event) => updateField("role", event.target.value as AdminUser["role"])}>
              {roles.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <label>
            Status
            <select value={form.status} onChange={(event) => updateField("status", event.target.value as AdminUser["status"])}>
              {statuses.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <label>
            Businesses
            <input
              min={0}
              type="number"
              value={form.businesses}
              onChange={(event) => updateField("businesses", Number(event.target.value))}
            />
          </label>
          <label>
            Reviews
            <input
              min={0}
              type="number"
              value={form.reviews}
              onChange={(event) => updateField("reviews", Number(event.target.value))}
            />
          </label>
          <label>
            Last seen
            <input value={form.lastSeen} onChange={(event) => updateField("lastSeen", event.target.value)} placeholder="Now" />
          </label>
          <div className="superadmin-form-actions">
            <button className="button button--primary" onClick={saveUser} type="button">
              {editingId ? <Save size={15} aria-hidden /> : <Plus size={15} aria-hidden />}
              {editingId ? "Save changes" : "Add user"}
            </button>
            {editingId ? (
              <button className="button button--outline" onClick={resetForm} type="button">
                <X size={15} aria-hidden />
                Cancel
              </button>
            ) : null}
          </div>
        </div>
      </section>

      <section className="superadmin-panel">
        <div className="superadmin-filters">
          <input
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search user, email, role, status..."
            value={query}
          />
          <select onChange={(event) => setRole(event.target.value)} value={role}>
            <option value="all">All roles</option>
            {roles.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <div className="superadmin-table superadmin-table--users">
          {filtered.map((user) => (
            <article key={user.id}>
              <div>
                <strong>{user.name}</strong>
                <span>{user.email}</span>
              </div>
              <span>{user.role}</span>
              <span data-status={user.status}>{user.status}</span>
              <span>
                {user.businesses} businesses / {user.reviews} reviews
              </span>
              <span>{user.lastSeen}</span>
              <div className="superadmin-actions">
                <button onClick={() => startEdit(user)} type="button">
                  <Edit3 size={14} aria-hidden />
                  Edit
                </button>
                <button data-danger onClick={() => suspendUser(user.id)} type="button">
                  <ShieldAlert size={14} aria-hidden />
                  Suspend
                </button>
                <button onClick={() => restoreUser(user.id)} type="button">
                  <RotateCcw size={14} aria-hidden />
                  Restore
                </button>
                <button data-danger onClick={() => deleteUser(user.id)} type="button">
                  <Trash2 size={14} aria-hidden />
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
