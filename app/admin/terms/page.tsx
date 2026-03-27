"use client";

import { useState, useEffect } from "react";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";

interface TermsSection {
  id: string;
  title: string;
  content: string;
  order_number: number;
}

const mockTermsSections: TermsSection[] = [
  {
    id: "1",
    title: "مقدمة",
    content:
      "مرحبًا بكم في منصة AdVault. تُحدد هذه الشروط والأحكام القواعد والأنظمة الخاصة باستخدام منصتنا. باستخدامك لهذا الموقع، فإنك توافق على الالتزام بهذه الشروط. إذا كنت لا توافق على أي جزء من هذه الشروط، يُرجى عدم استخدام المنصة. نحتفظ بالحق في تعديل هذه الشروط في أي وقت دون إشعار مسبق.",
    order_number: 1,
  },
  {
    id: "2",
    title: "شروط الاستخدام",
    content:
      "يجب أن يكون عمرك 18 عامًا أو أكثر لاستخدام هذه المنصة. أنت مسؤول عن الحفاظ على سرية حسابك وكلمة المرور الخاصة بك. يُحظر استخدام المنصة لأي أغراض غير قانونية أو غير مصرح بها. لا يجوز لك نسخ أو توزيع أو تعديل أي محتوى من المنصة دون إذن كتابي مسبق. نحتفظ بالحق في تعليق أو إنهاء حسابك في حالة انتهاك هذه الشروط.",
    order_number: 2,
  },
  {
    id: "3",
    title: "سياسة الخصوصية",
    content:
      "نحن نأخذ خصوصيتك على محمل الجد. نقوم بجمع البيانات الشخصية اللازمة لتقديم خدماتنا فقط، بما في ذلك الاسم والبريد الإلكتروني ومعلومات الاشتراك. لا نشارك بياناتك مع أطراف ثالثة إلا بموافقتك الصريحة أو عندما يتطلب القانون ذلك. نستخدم تقنيات تشفير متقدمة لحماية بياناتك. يمكنك طلب حذف بياناتك في أي وقت عبر التواصل معنا.",
    order_number: 3,
  },
  {
    id: "4",
    title: "حقوق الملكية",
    content:
      "جميع المحتويات المعروضة على المنصة، بما في ذلك الإعلانات والتحليلات والاستراتيجيات، محمية بموجب قوانين الملكية الفكرية. تحتفظ AdVault بجميع حقوق الملكية الفكرية المتعلقة بالمنصة ومحتواها. يُمنح المستخدمون ترخيصًا محدودًا وغير حصري للوصول إلى المحتوى واستخدامه للأغراض المهنية المشروعة فقط. أي انتهاك لحقوق الملكية قد يؤدي إلى إجراءات قانونية.",
    order_number: 4,
  },
  {
    id: "5",
    title: "إخلاء المسؤولية",
    content:
      'تُقدم المنصة والمحتوى المتاح عليها "كما هي" دون أي ضمانات صريحة أو ضمنية. لا نضمن دقة أو اكتمال أو موثوقية أي محتوى على المنصة. لن تكون AdVault مسؤولة عن أي أضرار مباشرة أو غير مباشرة ناتجة عن استخدام المنصة. التحليلات والتوصيات المقدمة هي لأغراض إرشادية فقط ولا تُعتبر نصيحة مهنية ملزمة.',
    order_number: 5,
  },
  {
    id: "6",
    title: "التواصل",
    content:
      "إذا كانت لديك أي أسئلة أو استفسارات بشأن هذه الشروط والأحكام، يُرجى التواصل معنا عبر البريد الإلكتروني: support@advault.io أو من خلال نموذج التواصل المتاح في المنصة. نسعى للرد على جميع الاستفسارات خلال 48 ساعة عمل. مقرنا الرئيسي في منطقة الشرق الأوسط وشمال أفريقيا ونخدم العملاء في جميع أنحاء المنطقة.",
    order_number: 6,
  },
];

export default function AdminTermsPage() {
  const [sections, setSections] = useState<TermsSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<TermsSection | null>(null);
  const [formTitle, setFormTitle] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formOrder, setFormOrder] = useState(1);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    fetchSections();
  }, []);

  async function fetchSections() {
    setLoading(true);
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from("terms_sections")
        .select("*")
        .order("order_number", { ascending: true });
      if (!error && data && data.length > 0) {
        setSections(data);
        setLoading(false);
        return;
      }
    }
    setSections([...mockTermsSections].sort((a, b) => a.order_number - b.order_number));
    setLoading(false);
  }

  function openAddModal() {
    setEditingSection(null);
    setFormTitle("");
    setFormContent("");
    setFormOrder(sections.length > 0 ? Math.max(...sections.map((s) => s.order_number)) + 1 : 1);
    setModalOpen(true);
  }

  function openEditModal(section: TermsSection) {
    setEditingSection(section);
    setFormTitle(section.title);
    setFormContent(section.content);
    setFormOrder(section.order_number);
    setModalOpen(true);
  }

  async function handleSave() {
    if (!formTitle.trim() || !formContent.trim()) return;

    if (editingSection) {
      const updated: TermsSection = {
        ...editingSection,
        title: formTitle,
        content: formContent,
        order_number: formOrder,
      };
      if (isSupabaseConfigured()) {
        await supabase.from("terms_sections").upsert(updated);
      }
      setSections((prev) =>
        prev
          .map((s) => (s.id === editingSection.id ? updated : s))
          .sort((a, b) => a.order_number - b.order_number)
      );
    } else {
      const newSection: TermsSection = {
        id: crypto.randomUUID(),
        title: formTitle,
        content: formContent,
        order_number: formOrder,
      };
      if (isSupabaseConfigured()) {
        await supabase.from("terms_sections").insert(newSection);
      }
      setSections((prev) => [...prev, newSection].sort((a, b) => a.order_number - b.order_number));
    }
    setModalOpen(false);
  }

  async function handleDelete(id: string) {
    if (isSupabaseConfigured()) {
      await supabase.from("terms_sections").delete().eq("id", id);
    }
    setSections((prev) => prev.filter((s) => s.id !== id));
    setDeleteConfirmId(null);
  }

  async function moveSection(id: string, direction: "up" | "down") {
    const idx = sections.findIndex((s) => s.id === id);
    if (idx === -1) return;
    if (direction === "up" && idx === 0) return;
    if (direction === "down" && idx === sections.length - 1) return;

    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    const updated = [...sections];
    const tempOrder = updated[idx].order_number;
    updated[idx] = { ...updated[idx], order_number: updated[swapIdx].order_number };
    updated[swapIdx] = { ...updated[swapIdx], order_number: tempOrder };
    updated.sort((a, b) => a.order_number - b.order_number);

    if (isSupabaseConfigured()) {
      await supabase.from("terms_sections").upsert([updated[idx], updated[swapIdx]]);
    }
    setSections(updated);
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#ffffff", padding: "32px" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "32px",
        }}
      >
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#1c1c1e", margin: 0 }}>
            الشروط والأحكام
          </h1>
          <p style={{ fontSize: "14px", color: "#6b7280", marginTop: "4px" }}>
            إدارة أقسام صفحة الشروط والأحكام
          </p>
        </div>
        <button
          onClick={openAddModal}
          style={{
            backgroundColor: "#3b82f6",
            color: "#ffffff",
            border: "none",
            borderRadius: "8px",
            padding: "10px 20px",
            fontSize: "14px",
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          + إضافة قسم جديد
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <p style={{ color: "#6b7280", textAlign: "center", padding: "40px 0" }}>جاري التحميل...</p>
      )}

      {/* Sections List */}
      {!loading && sections.length === 0 && (
        <p style={{ color: "#6b7280", textAlign: "center", padding: "40px 0" }}>
          لا توجد أقسام بعد. أضف قسمًا جديدًا للبدء.
        </p>
      )}

      {(() => {
        const termsSections = sections.filter(s => s.title !== "سياسة الخصوصية");
        const privacySections = sections.filter(s => s.title === "سياسة الخصوصية");

        const renderSectionCard = (section: TermsSection, idx: number, list: TermsSection[]) => (
          <div
            key={section.id}
            style={{
              backgroundColor: "#ffffff",
              border: "1px solid #dbeafe",
              borderRadius: "12px",
              padding: "20px",
              display: "flex",
              alignItems: "flex-start",
              gap: "16px",
            }}
          >
            {/* Order Number */}
            <div
              style={{
                minWidth: "40px",
                height: "40px",
                borderRadius: "8px",
                backgroundColor: "#f3f4f6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "16px",
                fontWeight: 700,
                color: "#3b82f6",
                flexShrink: 0,
              }}
            >
              {section.order_number}
            </div>

            {/* Content */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#1c1c1e", margin: 0 }}>
                {section.title}
              </h3>
              <p
                style={{
                  fontSize: "13px",
                  color: "#6b7280",
                  marginTop: "6px",
                  lineHeight: "1.6",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {section.content}
              </p>
            </div>

            {/* Reorder Buttons */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "4px",
                flexShrink: 0,
              }}
            >
              <button
                onClick={() => moveSection(section.id, "up")}
                disabled={idx === 0}
                style={{
                  width: "32px",
                  height: "32px",
                  border: "1px solid #dbeafe",
                  borderRadius: "6px",
                  backgroundColor: idx === 0 ? "#f9fafb" : "#ffffff",
                  color: idx === 0 ? "#d1d5db" : "#6b7280",
                  cursor: idx === 0 ? "default" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "14px",
                }}
              >
                ▲
              </button>
              <button
                onClick={() => moveSection(section.id, "down")}
                disabled={idx === list.length - 1}
                style={{
                  width: "32px",
                  height: "32px",
                  border: "1px solid #dbeafe",
                  borderRadius: "6px",
                  backgroundColor: idx === list.length - 1 ? "#f9fafb" : "#ffffff",
                  color: idx === list.length - 1 ? "#d1d5db" : "#6b7280",
                  cursor: idx === list.length - 1 ? "default" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "14px",
                }}
              >
                ▼
              </button>
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
              <button
                onClick={() => openEditModal(section)}
                style={{
                  padding: "8px 16px",
                  border: "1px solid #dbeafe",
                  borderRadius: "6px",
                  backgroundColor: "#ffffff",
                  color: "#1c1c1e",
                  fontSize: "13px",
                  cursor: "pointer",
                }}
              >
                تعديل
              </button>
              {deleteConfirmId === section.id ? (
                <div style={{ display: "flex", gap: "4px" }}>
                  <button
                    onClick={() => handleDelete(section.id)}
                    style={{
                      padding: "8px 12px",
                      border: "none",
                      borderRadius: "6px",
                      backgroundColor: "#ef4444",
                      color: "#ffffff",
                      fontSize: "13px",
                      cursor: "pointer",
                    }}
                  >
                    تأكيد
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(null)}
                    style={{
                      padding: "8px 12px",
                      border: "1px solid #dbeafe",
                      borderRadius: "6px",
                      backgroundColor: "#ffffff",
                      color: "#6b7280",
                      fontSize: "13px",
                      cursor: "pointer",
                    }}
                  >
                    إلغاء
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setDeleteConfirmId(section.id)}
                  style={{
                    padding: "8px 16px",
                    border: "1px solid #fecaca",
                    borderRadius: "6px",
                    backgroundColor: "#fef2f2",
                    color: "#ef4444",
                    fontSize: "13px",
                    cursor: "pointer",
                  }}
                >
                  حذف
                </button>
              )}
            </div>
          </div>
        );

        return (
          <>
            {/* Group 1: Terms & Conditions */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-3">الشروط والأحكام</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {termsSections.map((section, idx) => renderSectionCard(section, idx, termsSections))}
              </div>
              {termsSections.length === 0 && (
                <p style={{ color: "#6b7280", textAlign: "center", padding: "20px 0" }}>
                  لا توجد أقسام في الشروط والأحكام.
                </p>
              )}
            </div>

            {/* Group 2: Privacy Policy */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-3">سياسة الخصوصية</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {privacySections.map((section, idx) => renderSectionCard(section, idx, privacySections))}
              </div>
              {privacySections.length === 0 && (
                <p style={{ color: "#6b7280", textAlign: "center", padding: "20px 0" }}>
                  لا توجد أقسام في سياسة الخصوصية.
                </p>
              )}
            </div>
          </>
        );
      })()}

      {/* Modal */}
      {modalOpen && (
        <div
          onClick={() => setModalOpen(false)}
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
              maxWidth: "600px",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <h2
              style={{
                fontSize: "20px",
                fontWeight: 700,
                color: "#1c1c1e",
                margin: "0 0 24px 0",
              }}
            >
              {editingSection ? "تعديل القسم" : "إضافة قسم جديد"}
            </h2>

            {/* Title */}
            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#1c1c1e",
                  marginBottom: "6px",
                }}
              >
                عنوان القسم
              </label>
              <input
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="أدخل عنوان القسم"
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  border: "1px solid #dbeafe",
                  borderRadius: "8px",
                  fontSize: "14px",
                  color: "#1c1c1e",
                  backgroundColor: "#ffffff",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* Content */}
            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#1c1c1e",
                  marginBottom: "6px",
                }}
              >
                المحتوى
              </label>
              <textarea
                value={formContent}
                onChange={(e) => setFormContent(e.target.value)}
                placeholder="أدخل محتوى القسم"
                rows={10}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  border: "1px solid #dbeafe",
                  borderRadius: "8px",
                  fontSize: "14px",
                  color: "#1c1c1e",
                  backgroundColor: "#ffffff",
                  outline: "none",
                  resize: "vertical",
                  lineHeight: "1.7",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* Order */}
            <div style={{ marginBottom: "24px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#1c1c1e",
                  marginBottom: "6px",
                }}
              >
                رقم الترتيب
              </label>
              <input
                type="number"
                value={formOrder}
                onChange={(e) => setFormOrder(Number(e.target.value))}
                min={1}
                style={{
                  width: "100px",
                  padding: "10px 14px",
                  border: "1px solid #dbeafe",
                  borderRadius: "8px",
                  fontSize: "14px",
                  color: "#1c1c1e",
                  backgroundColor: "#ffffff",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: "12px", justifyContent: "flex-start" }}>
              <button
                onClick={handleSave}
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
                حفظ
              </button>
              <button
                onClick={() => setModalOpen(false)}
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
