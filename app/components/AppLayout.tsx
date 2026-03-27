"use client";

import TopNavbar from "./TopNavbar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <TopNavbar />
      <main className="pt-20 min-w-0">{children}</main>
    </div>
  );
}
