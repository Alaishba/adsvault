"use client";

import { useState, useEffect } from "react";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import { fetchUsers } from "../../lib/db";

type User = { id: string; email: string; full_name: string; plan: string; created_at: string; status: string };

const mockUsers: User[] = [
  { id: "1", email: "ahmed@example.com", full_name: "أحمد محمد", plan: "pro", created_at: "2024-03-15", status: "active" },
  { id: "2", email: "fatima@example.com", full_name: "فاطمة العلي", plan: "free", created_at: "2024-03-14", status: "active" },
  { id: "3", email: "khalid@example.com", full_name: "خالد المنصور", plan: "pro", created_at: "2024-03-13", status: "active" },
  { id: "4", email: "nour@example.com", full_name: "نور الهاشمي", plan: "enterprise", created_at: "2024-03-12", status: "active" },
  { id: "5", email: "sara@example.com", full_name: "سارة البلوشي", plan: "free", created_at: "2024-03-11", status: "suspended" },
  { id: "6", email: "fahad@example.com", full_name: "فهد الدوسري", plan: "pro", created_at: "2024-03-10", status: "active" },
];

const planStyle: Record<string, { bg: string; color: string }> = {
  pro:        { bg: "#f3eeff", color: "#8957f6" },
  enterprise: { bg: "#eff6ff", color: "#2563eb" },
  free:       { bg: "#f3f5f9", color: "#6b7280" },
  admin:      { bg: "#fef2f2", color: "#ef4444" },
};

const plans = ["free", "pro", "enterprise", "admin"];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchUsers().then((data) => {
      if (data.length) {
        setUsers(data.map((u: any) => ({ ...u, status: u.status || "active" })));
      }
    });
  }, []);

  const filtered = users.filter(
    (u) => u.full_name.includes(search) || u.email.includes(search)
  );

  const changePlan = async (id: string, plan: string) => {
    if (isSupabaseConfigured()) {
      await supabase.from("users").update({ plan }).eq("id", id);
    }
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, plan } : u)));
  };

  const toggleStatus = (id: string) =>
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: u.status === "active" ? "suspended" : "active" } : u))
    );

  return (
    <div className="px-6 lg:px-10 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-[#1c1c1e]">المستخدمون</h1>
        <p className="text-sm mt-0.5" style={{ color: "#6b7280" }}>{filtered.length} مستخدم</p>
      </div>

      <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border mb-5"
        style={{ background: "#ffffff", borderColor: "#e5e7eb" }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="ابحث عن مستخدم..."
          className="bg-transparent outline-none w-full text-sm text-[#1c1c1e] placeholder:text-[#9ca3af]" dir="rtl" />
      </div>

      <div className="rounded-2xl border overflow-hidden" style={{ background: "#ffffff", borderColor: "#e5e7eb" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "#f3f5f9" }}>
                {["الاسم", "البريد", "الخطة", "تاريخ التسجيل", "الحالة", "الإجراءات"].map((h) => (
                  <th key={h} className="text-right px-5 py-3 text-xs font-bold uppercase tracking-wider"
                    style={{ color: "#6b7280" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "#e5e7eb" }}>
              {filtered.map((u) => {
                const ps = planStyle[u.plan] ?? planStyle.free;
                return (
                  <tr key={u.id} className="hover:bg-[#f3f5f9] transition-colors">
                    <td className="px-5 py-3 font-semibold text-[#1c1c1e]">{u.full_name}</td>
                    <td className="px-5 py-3" style={{ color: "#6b7280" }} dir="ltr">{u.email}</td>
                    <td className="px-5 py-3">
                      <select value={u.plan} onChange={(e) => changePlan(u.id, e.target.value)}
                        className="text-xs px-2 py-1 rounded-lg font-bold border-0 cursor-pointer outline-none"
                        style={{ background: ps.bg, color: ps.color }}>
                        {plans.map((p) => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </td>
                    <td className="px-5 py-3" style={{ color: "#6b7280" }} dir="ltr">{u.created_at}</td>
                    <td className="px-5 py-3">
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold"
                        style={{
                          background: u.status === "active" ? "#f7fee7" : "#fef2f2",
                          color: u.status === "active" ? "#84cc18" : "#ef4444",
                        }}>
                        {u.status === "active" ? "نشط" : "موقوف"}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <button onClick={() => toggleStatus(u.id)}
                        className="text-xs px-2.5 py-1 rounded-lg font-medium border border-[#e5e7eb] hover:border-[#8957f6]/40 transition-all"
                        style={{ color: "#6b7280" }}>
                        {u.status === "active" ? "تعليق" : "تفعيل"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
