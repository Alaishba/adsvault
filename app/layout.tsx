import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "./context/ThemeContext";
import ScrollProgress from "./components/ScrollProgress";
import { ToastProvider } from "./components/Toast";

export const metadata: Metadata = {
  title: "AdVault",
  description: "منصة B2B للذكاء الإعلاني في منطقة MENA – فكك الإعلانات الناجحة وطبّقها باحتراف",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <ToastProvider>
            <ScrollProgress />
            {children}
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
