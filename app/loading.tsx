export default function Loading() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg)",
        gap: "1rem",
      }}
    >
      <style>{`
        @keyframes advault-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
      <div
        style={{
          width: "48px",
          height: "48px",
          border: "4px solid rgba(37,99,235,0.2)",
          borderTopColor: "#2563eb",
          borderRadius: "50%",
          animation: "advault-spin 0.8s linear infinite",
        }}
      />
      <span
        style={{
          color: "var(--text-secondary)",
          fontSize: "1rem",
          fontWeight: 500,
        }}
      >
        جارٍ التحميل...
      </span>
    </div>
  );
}
