"use client";

import TopNavbar from "./TopNavbar";
import Footer from "./Footer";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <TopNavbar />
      <main className="pt-20 min-w-0 flex-1">{children}</main>
      <Footer />
    </div>
  );
}
