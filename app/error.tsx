"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
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
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⚠️</div>
        <h1
          style={{
            color: "var(--text-primary)",
            fontSize: "1.5rem",
            fontWeight: 700,
            marginBottom: "0.75rem",
          }}
        >
          حدث خطأ غير متوقع
        </h1>
        {error.message && (
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "0.95rem",
              marginBottom: "1.5rem",
              lineHeight: 1.6,
            }}
          >
            {error.message}
          </p>
        )}
        <button
          onClick={() => reset()}
          style={{
            background: "#2563eb",
            color: "#ffffff",
            border: "none",
            borderRadius: "0.5rem",
            padding: "0.75rem 2rem",
            fontSize: "1rem",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          حاول مرة أخرى
        </button>
      </div>
    </div>
  );
}
