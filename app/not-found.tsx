import Link from "next/link";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg)",
        padding: "2rem",
      }}
    >
      <div
        style={{
          background: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: "1rem",
          padding: "3rem 2rem",
          maxWidth: "480px",
          width: "100%",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: "6rem",
            fontWeight: 800,
            color: "var(--text-secondary)",
            lineHeight: 1,
            marginBottom: "1rem",
          }}
        >
          404
        </div>
        <h1
          style={{
            color: "var(--text-primary)",
            fontSize: "1.5rem",
            fontWeight: 700,
            marginBottom: "0.75rem",
          }}
        >
          الصفحة غير موجودة
        </h1>
        <p
          style={{
            color: "var(--text-secondary)",
            fontSize: "0.95rem",
            marginBottom: "2rem",
            lineHeight: 1.6,
          }}
        >
          الصفحة التي تبحث عنها غير متوفرة أو تم نقلها
        </p>
        <Link
          href="/"
          style={{
            display: "inline-block",
            background: "#2563eb",
            color: "#ffffff",
            borderRadius: "0.5rem",
            padding: "0.75rem 2rem",
            fontSize: "1rem",
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          العودة للرئيسية
        </Link>
      </div>
    </div>
  );
}
