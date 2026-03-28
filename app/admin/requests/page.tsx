"use client";

import { useState } from "react";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";

type RequestStatus = "جديد" | "قيد المراجعة" | "مكتمل";

interface ContactRequest {
  id: string;
  name: string;
  email: string;
  company: string;
  message: string;
  created_at: string;
  status: RequestStatus;
}

interface RemovalRequest {
  id: string;
  name: string;
  email: string;
  content_url: string;
  reason: string;
  created_at: string;
  status: RequestStatus;
}

interface SupportRequest {
  id: string;
  name: string;
  email: string;
  request_type: string;
  message: string;
  created_at: string;
  status: RequestStatus;
}

const mockContactRequests: ContactRequest[] = [
  { id: "c1", name: "أحمد الراشد", email: "ahmed@company.sa", company: "شركة النور للتسويق", message: "نرغب في الاشتراك بخطة المؤسسات لفريق مكون من 15 شخص. نرجو التواصل لمناقشة التفاصيل.", created_at: "2026-03-18", status: "جديد" },
  { id: "c2", name: "فاطمة العلي", email: "fatima@mediahouse.ae", company: "ميديا هاوس", message: "هل يمكنكم توفير عرض خاص للوكالات الإعلانية؟ لدينا أكثر من 20 عميل محتمل.", created_at: "2026-03-17", status: "قيد المراجعة" },
  { id: "c3", name: "خالد المنصور", email: "khaled@brands.kw", company: "براندز الكويت", message: "نبحث عن شراكة استراتيجية لتوفير تحليلات الإعلانات لعملائنا في الخليج.", created_at: "2026-03-15", status: "جديد" },
  { id: "c4", name: "نورة الحسن", email: "noura@digitalegy.com", company: "ديجيتال إيجي", message: "أريد معرفة المزيد عن إمكانيات التحليل المتقدم وكيف يمكن دمجها مع أدواتنا الحالية.", created_at: "2026-03-14", status: "مكتمل" },
  { id: "c5", name: "سعود القحطاني", email: "saud@adagency.sa", company: "وكالة سعود الإعلانية", message: "هل تقدمون خصومات للاشتراكات السنوية؟ نحتاج اشتراك لـ 8 مستخدمين.", created_at: "2026-03-12", status: "جديد" },
];

const mockRemovalRequests: RemovalRequest[] = [
  { id: "r1", name: "ليلى أحمد", email: "layla@brand.com", content_url: "https://mulhem.com/library/ad-2847", reason: "الإعلان يحتوي على علامتنا التجارية بدون إذن", created_at: "2026-03-19", status: "جديد" },
  { id: "r2", name: "عمر السعيد", email: "omar@agency.ae", content_url: "https://mulhem.com/library/ad-1523", reason: "محتوى قديم ولم يعد يمثل حملتنا الحالية", created_at: "2026-03-16", status: "قيد المراجعة" },
  { id: "r3", name: "هند الكاظمي", email: "hind@corp.bh", content_url: "https://mulhem.com/library/ad-3901", reason: "بيانات غير دقيقة في التحليل المرفق بالإعلان", created_at: "2026-03-10", status: "مكتمل" },
];

const mockSupportRequests: SupportRequest[] = [
  { id: "s1", name: "محمد العتيبي", email: "mohammed@user.sa", request_type: "مشكلة تقنية", message: "لا أستطيع تحميل الصور في لوحة التحكم. تظهر رسالة خطأ عند رفع ملفات أكبر من 2MB.", created_at: "2026-03-19", status: "جديد" },
  { id: "s2", name: "سارة الشمري", email: "sara@user.kw", request_type: "استفسار عام", message: "كيف يمكنني تصدير تقارير التحليل بصيغة PDF؟ لم أجد الخيار في لوحة التحكم.", created_at: "2026-03-18", status: "جديد" },
  { id: "s3", name: "يوسف الدوسري", email: "yousef@user.ae", request_type: "مشكلة في الدفع", message: "تم خصم المبلغ من بطاقتي لكن لم يتم ترقية حسابي إلى Pro بعد مرور 24 ساعة.", created_at: "2026-03-17", status: "قيد المراجعة" },
  { id: "s4", name: "ريم الفهد", email: "reem@user.qa", request_type: "اقتراح تحسين", message: "أقترح إضافة فلتر حسب اللغة في مكتبة الإعلانات لتسهيل البحث عن الإعلانات العربية.", created_at: "2026-03-15", status: "مكتمل" },
];

type TabKey = "contact" | "removal" | "support";

const statusColors: Record<RequestStatus, { bg: string; text: string }> = {
  "جديد": { bg: "#fef3c7", text: "#92400e" },
  "قيد المراجعة": { bg: "#dbeafe", text: "#1e40af" },
  "مكتمل": { bg: "#d1fae5", text: "#065f46" },
};

export default function AdminRequestsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("contact");
  const [contactRequests, setContactRequests] = useState<ContactRequest[]>(mockContactRequests);
  const [removalRequests, setRemovalRequests] = useState<RemovalRequest[]>(mockRemovalRequests);
  const [supportRequests, setSupportRequests] = useState<SupportRequest[]>(mockSupportRequests);
  const [replyModalId, setReplyModalId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const newContactCount = contactRequests.filter((r) => r.status === "جديد").length;
  const newRemovalCount = removalRequests.filter((r) => r.status === "جديد").length;
  const newSupportCount = supportRequests.filter((r) => r.status === "جديد").length;

  const tabs: { key: TabKey; label: string; count: number }[] = [
    { key: "contact", label: "طلبات التواصل", count: newContactCount },
    { key: "removal", label: "طلبات إزالة المحتوى", count: newRemovalCount },
    { key: "support", label: "طلبات الدعم الفني", count: newSupportCount },
  ];

  async function updateContactStatus(id: string, status: RequestStatus) {
    setContactRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    if (isSupabaseConfigured()) {
      await supabase.from("contact_requests").update({ status }).eq("id", id);
    }
  }

  async function deleteContact(id: string) {
    setContactRequests((prev) => prev.filter((r) => r.id !== id));
    if (isSupabaseConfigured()) {
      await supabase.from("contact_requests").delete().eq("id", id);
    }
  }

  async function updateRemovalStatus(id: string, status: RequestStatus) {
    setRemovalRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    if (isSupabaseConfigured()) {
      await supabase.from("removal_requests").update({ status }).eq("id", id);
    }
  }

  async function deleteRemoval(id: string) {
    setRemovalRequests((prev) => prev.filter((r) => r.id !== id));
    if (isSupabaseConfigured()) {
      await supabase.from("removal_requests").delete().eq("id", id);
    }
  }

  async function updateSupportStatus(id: string, status: RequestStatus) {
    setSupportRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    if (isSupabaseConfigured()) {
      await supabase.from("support_requests").update({ status }).eq("id", id);
    }
  }

  async function deleteSupport(id: string) {
    setSupportRequests((prev) => prev.filter((r) => r.id !== id));
    if (isSupabaseConfigured()) {
      await supabase.from("support_requests").delete().eq("id", id);
    }
  }

  function handleReply() {
    if (!replyText.trim()) return;
    // In production, send reply via email API
    setReplyModalId(null);
    setReplyText("");
  }

  function StatusBadge({ status }: { status: RequestStatus }) {
    const colors = statusColors[status];
    return (
      <span
        style={{
          display: "inline-block",
          padding: "4px 10px",
          borderRadius: "9999px",
          fontSize: "12px",
          fontWeight: 600,
          backgroundColor: colors.bg,
          color: colors.text,
        }}
      >
        {status}
      </span>
    );
  }

  function StatusSelect({
    value,
    onChange,
  }: {
    value: RequestStatus;
    onChange: (s: RequestStatus) => void;
  }) {
    return (
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as RequestStatus)}
        style={{
          padding: "6px 10px",
          border: "1px solid #dbeafe",
          borderRadius: "6px",
          fontSize: "12px",
          color: "#1c1c1e",
          backgroundColor: "#ffffff",
          cursor: "pointer",
          outline: "none",
        }}
      >
        <option value="جديد">جديد</option>
        <option value="قيد المراجعة">قيد المراجعة</option>
        <option value="مكتمل">مكتمل</option>
      </select>
    );
  }

  function DeleteButton({ onClick }: { onClick: () => void }) {
    return (
      <button
        onClick={onClick}
        style={{
          padding: "6px 12px",
          border: "1px solid #fecaca",
          borderRadius: "6px",
          backgroundColor: "#fef2f2",
          color: "#ef4444",
          fontSize: "12px",
          cursor: "pointer",
        }}
      >
        حذف
      </button>
    );
  }

  const thStyle: React.CSSProperties = {
    padding: "12px 16px",
    fontSize: "13px",
    fontWeight: 600,
    color: "#6b7280",
    textAlign: "right",
    borderBottom: "1px solid #dbeafe",
    whiteSpace: "nowrap",
  };

  const tdStyle: React.CSSProperties = {
    padding: "12px 16px",
    fontSize: "13px",
    color: "#1c1c1e",
    borderBottom: "1px solid #f3f4f6",
    verticalAlign: "top",
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#ffffff", padding: "32px" }}>
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#1c1c1e", margin: 0 }}>
          مركز الطلبات
        </h1>
        <p style={{ fontSize: "14px", color: "#6b7280", marginTop: "4px" }}>
          إدارة جميع الطلبات الواردة من المستخدمين
        </p>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: "0",
          borderBottom: "2px solid #dbeafe",
          marginBottom: "24px",
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: "12px 24px",
              fontSize: "14px",
              fontWeight: activeTab === tab.key ? 600 : 400,
              color: activeTab === tab.key ? "#3b82f6" : "#6b7280",
              backgroundColor: "transparent",
              border: "none",
              borderBottom: activeTab === tab.key ? "2px solid #3b82f6" : "2px solid transparent",
              marginBottom: "-2px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            {tab.label}
            {tab.count > 0 && (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minWidth: "20px",
                  height: "20px",
                  borderRadius: "9999px",
                  backgroundColor: "#fef3c7",
                  color: "#92400e",
                  fontSize: "11px",
                  fontWeight: 700,
                  padding: "0 6px",
                }}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Contact Requests Tab */}
      {activeTab === "contact" && (
        <div
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #dbeafe",
            borderRadius: "12px",
            overflow: "hidden",
          }}
        >
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#f9fafb" }}>
                  <th style={thStyle}>الاسم</th>
                  <th style={thStyle}>البريد</th>
                  <th style={thStyle}>الشركة</th>
                  <th style={{ ...thStyle, minWidth: "200px" }}>الرسالة</th>
                  <th style={thStyle}>التاريخ</th>
                  <th style={thStyle}>الحالة</th>
                  <th style={thStyle}>إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {contactRequests.map((req) => (
                  <tr key={req.id}>
                    <td style={{ ...tdStyle, fontWeight: 600, whiteSpace: "nowrap" }}>{req.name}</td>
                    <td style={{ ...tdStyle, direction: "ltr", textAlign: "right" }}>{req.email}</td>
                    <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>{req.company}</td>
                    <td style={{ ...tdStyle, maxWidth: "250px", lineHeight: "1.5" }}>{req.message}</td>
                    <td style={{ ...tdStyle, whiteSpace: "nowrap", color: "#6b7280" }}>{req.created_at}</td>
                    <td style={tdStyle}>
                      <StatusBadge status={req.status} />
                    </td>
                    <td style={tdStyle}>
                      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        <StatusSelect value={req.status} onChange={(s) => updateContactStatus(req.id, s)} />
                        <DeleteButton onClick={() => deleteContact(req.id)} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {contactRequests.length === 0 && (
            <p style={{ textAlign: "center", color: "#6b7280", padding: "32px" }}>
              لا توجد طلبات تواصل
            </p>
          )}
        </div>
      )}

      {/* Removal Requests Tab */}
      {activeTab === "removal" && (
        <div
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #dbeafe",
            borderRadius: "12px",
            overflow: "hidden",
          }}
        >
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#f9fafb" }}>
                  <th style={thStyle}>الاسم</th>
                  <th style={thStyle}>البريد</th>
                  <th style={thStyle}>رابط المحتوى</th>
                  <th style={{ ...thStyle, minWidth: "200px" }}>السبب</th>
                  <th style={thStyle}>التاريخ</th>
                  <th style={thStyle}>الحالة</th>
                  <th style={thStyle}>إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {removalRequests.map((req) => (
                  <tr key={req.id}>
                    <td style={{ ...tdStyle, fontWeight: 600, whiteSpace: "nowrap" }}>{req.name}</td>
                    <td style={{ ...tdStyle, direction: "ltr", textAlign: "right" }}>{req.email}</td>
                    <td style={tdStyle}>
                      <a
                        href={req.content_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "#3b82f6", textDecoration: "none", fontSize: "13px" }}
                      >
                        عرض المحتوى
                      </a>
                    </td>
                    <td style={{ ...tdStyle, maxWidth: "250px", lineHeight: "1.5" }}>{req.reason}</td>
                    <td style={{ ...tdStyle, whiteSpace: "nowrap", color: "#6b7280" }}>{req.created_at}</td>
                    <td style={tdStyle}>
                      <StatusBadge status={req.status} />
                    </td>
                    <td style={tdStyle}>
                      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        <StatusSelect value={req.status} onChange={(s) => updateRemovalStatus(req.id, s)} />
                        <DeleteButton onClick={() => deleteRemoval(req.id)} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {removalRequests.length === 0 && (
            <p style={{ textAlign: "center", color: "#6b7280", padding: "32px" }}>
              لا توجد طلبات إزالة
            </p>
          )}
        </div>
      )}

      {/* Support Requests Tab */}
      {activeTab === "support" && (
        <div
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #dbeafe",
            borderRadius: "12px",
            overflow: "hidden",
          }}
        >
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#f9fafb" }}>
                  <th style={thStyle}>الاسم</th>
                  <th style={thStyle}>البريد</th>
                  <th style={thStyle}>نوع الطلب</th>
                  <th style={{ ...thStyle, minWidth: "200px" }}>الرسالة</th>
                  <th style={thStyle}>التاريخ</th>
                  <th style={thStyle}>الحالة</th>
                  <th style={thStyle}>إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {supportRequests.map((req) => (
                  <tr key={req.id}>
                    <td style={{ ...tdStyle, fontWeight: 600, whiteSpace: "nowrap" }}>{req.name}</td>
                    <td style={{ ...tdStyle, direction: "ltr", textAlign: "right" }}>{req.email}</td>
                    <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>
                      <span
                        style={{
                          padding: "4px 10px",
                          borderRadius: "6px",
                          fontSize: "12px",
                          backgroundColor: "#f3f4f6",
                          color: "#1c1c1e",
                        }}
                      >
                        {req.request_type}
                      </span>
                    </td>
                    <td style={{ ...tdStyle, maxWidth: "250px", lineHeight: "1.5" }}>{req.message}</td>
                    <td style={{ ...tdStyle, whiteSpace: "nowrap", color: "#6b7280" }}>{req.created_at}</td>
                    <td style={tdStyle}>
                      <StatusBadge status={req.status} />
                    </td>
                    <td style={tdStyle}>
                      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        <StatusSelect value={req.status} onChange={(s) => updateSupportStatus(req.id, s)} />
                        <button
                          onClick={() => {
                            setReplyModalId(req.id);
                            setReplyText("");
                          }}
                          style={{
                            padding: "6px 12px",
                            border: "1px solid #dbeafe",
                            borderRadius: "6px",
                            backgroundColor: "#ffffff",
                            color: "#3b82f6",
                            fontSize: "12px",
                            fontWeight: 600,
                            cursor: "pointer",
                          }}
                        >
                          رد
                        </button>
                        <DeleteButton onClick={() => deleteSupport(req.id)} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {supportRequests.length === 0 && (
            <p style={{ textAlign: "center", color: "#6b7280", padding: "32px" }}>
              لا توجد طلبات دعم فني
            </p>
          )}
        </div>
      )}

      {/* Reply Modal */}
      {replyModalId && (
        <div
          onClick={() => setReplyModalId(null)}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "16px",
              padding: "32px",
              width: "90%",
              maxWidth: "500px",
            }}
          >
            <h2
              style={{
                fontSize: "20px",
                fontWeight: 700,
                color: "#1c1c1e",
                margin: "0 0 20px 0",
              }}
            >
              الرد على الطلب
            </h2>
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="اكتب ردك هنا..."
              rows={6}
              style={{
                width: "100%",
                padding: "12px 14px",
                border: "1px solid #dbeafe",
                borderRadius: "8px",
                fontSize: "14px",
                color: "#1c1c1e",
                backgroundColor: "#ffffff",
                outline: "none",
                resize: "vertical",
                lineHeight: "1.7",
                marginBottom: "20px",
                boxSizing: "border-box",
              }}
            />
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={handleReply}
                style={{
                  backgroundColor: "#3b82f6",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "8px",
                  padding: "10px 24px",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                إرسال الرد
              </button>
              <button
                onClick={() => setReplyModalId(null)}
                style={{
                  backgroundColor: "#ffffff",
                  color: "#6b7280",
                  border: "1px solid #dbeafe",
                  borderRadius: "8px",
                  padding: "10px 24px",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
