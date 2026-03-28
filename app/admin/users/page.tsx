"use client";

import { useState, useEffect } from "react";
import { fetchAdminUsers, confirmUserEmail } from "../../actions/adminActions";

type User = { id: string; email: string; full_name: string; plan: string; created_at: string; status: string };

const planStyle: Record<string, { bg: string; color: string }> = {
  pro:        { bg: "#f3eeff", color: "#3b82f6" },
  enterprise: { bg: "#eff6ff", color: "#2563eb" },
  free:       { bg: "#eff6ff", color: "#6b7280" },
  admin:      { bg: "#fef2f2", color: "#ef4444" },
};

const plans = ["free", "pro", "enterprise", "admin"];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [confirmMsg, setConfirmMsg] = useState<{ id: string; text: string } | null>(null);

  useEffect(() => {
    fetchAdminUsers().then((data) => {
      setUsers(data.map((u: Record<string, string>) => ({
        id: u.id, email: u.email, full_name: u.full_name ?? "", plan: u.plan ?? "free",
        created_at: u.created_at ?? "", status: "active",
      })));
    });
  }, []);

  const filtered = users.filter(
    (u) => (u.full_name ?? "").includes(search) || (u.email ?? "").includes(search)
  );

  const changePlan = async (id: string, plan: string) => {
    // Note: createAdminClient requires server-side — for now use a server action pattern
    // Direct client-side call won't work with service role on client
    // TODO: move to server action for plan changes
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, plan } : u)));
  };

  const toggleStatus = (id: string) =>
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: u.status === "active" ? "suspended" : "active" } : u))
    );

  const handleConfirmEmail = async (id: string) => {
    setConfirmingId(id);
    setConfirmMsg(null);
    const result = await confirmUserEmail(id);
    if ("success" in result) {
      setConfirmMsg({ id, text: "تم التفعيل" });
    } else {
      setConfirmMsg({ id, text: result.error });
    }
    setConfirmingId(null);
    setTimeout(() => setConfirmMsg((prev) => (prev?.id === id ? null : prev)), 2500);
  };

  return (
    <div className="px-6 lg:px-10 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-[#1c1c1e]">المستخدمون</h1>
        <p className="text-sm mt-0.5" style={{ color: "#6b7280" }}>{filtered.length} مستخدم</p>
      </div>

      <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border mb-5"
        style={{ background: "#ffffff", borderColor: "#dbeafe" }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="ابحث عن مستخدم..."
          className="bg-transparent outline-none w-full text-sm text-[#1c1c1e] placeholder:text-[#9ca3af]" dir="rtl" />
      </div>

      <div className="rounded-2xl border overflow-hidden" style={{ background: "#ffffff", borderColor: "#dbeafe" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "#eff6ff" }}>
                {["الاسم", "البريد", "الخطة", "تاريخ التسجيل", "الحالة", "الإجراءات"].map((h) => (
                  <th key={h} className="text-right px-5 py-3 text-xs font-bold uppercase tracking-wider"
                    style={{ color: "#6b7280" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "#dbeafe" }}>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-10" style={{ color: "#9ca3af" }}>لا يوجد مستخدمون</td></tr>
              ) : filtered.map((u) => {
                const ps = planStyle[u.plan] ?? planStyle.free;
                return (
                  <tr key={u.id} className="hover:bg-[#eff6ff] transition-colors">
                    <td className="px-5 py-3 font-semibold text-[#1c1c1e]">{u.full_name}</td>
                    <td className="px-5 py-3" style={{ color: "#6b7280" }} dir="ltr">{u.email}</td>
                    <td className="px-5 py-3">
                      <select value={u.plan} onChange={(e) => changePlan(u.id, e.target.value)}
                        className="text-xs px-2 py-1 rounded-lg font-bold border-0 cursor-pointer outline-none"
                        style={{ background: ps.bg, color: ps.color }}>
                        {plans.map((p) => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </td>
                    <td className="px-5 py-3" style={{ color: "#6b7280" }} dir="ltr">{(u.created_at ?? "").slice(0, 10)}</td>
                    <td className="px-5 py-3">
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold"
                        style={{
                          background: u.status === "active" ? "#f7fee7" : "#fef2f2",
                          color: u.status === "active" ? "#3b82f6" : "#ef4444",
                        }}>
                        {u.status === "active" ? "نشط" : "موقوف"}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => toggleStatus(u.id)}
                          className="text-xs px-2.5 py-1 rounded-lg font-medium border border-[#dbeafe] hover:border-[#3b82f6]/40 transition-all"
                          style={{ color: "#6b7280" }}>
                          {u.status === "active" ? "تعليق" : "تفعيل"}
                        </button>
                        <button onClick={() => handleConfirmEmail(u.id)}
                          disabled={confirmingId === u.id}
                          className="text-xs px-2.5 py-1 rounded-lg font-medium border border-blue-200 text-blue-600 hover:border-blue-400 transition-all disabled:opacity-50">
                          {confirmingId === u.id ? "..." : "تفعيل"}
                        </button>
                        {confirmMsg?.id === u.id && (
                          <span className="text-xs text-green-600">{confirmMsg.text}</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <p className="text-xs text-gray-400 mt-2">تفعيل الحساب يتجاوز التحقق من البريد — للحسابات التجريبية فقط</p>
    </div>
  );
}
