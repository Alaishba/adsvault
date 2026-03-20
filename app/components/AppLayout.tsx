"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <Sidebar
        mobileOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      {/* Offset right by sidebar width on desktop. overflow-x-hidden stops content
          from bleeding under the fixed sidebar. min-w-0 lets flex children
          shrink so truncate / line-clamp work correctly. */}
      <div className="lg:mr-64 min-h-screen overflow-x-hidden min-w-0">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="pt-16 min-w-0">{children}</main>
      </div>
    </div>
  );
}
