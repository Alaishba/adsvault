import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import ScrollProgress from "./components/ScrollProgress";
import { ToastProvider } from "./components/Toast";

export const metadata: Metadata = {
  title: "AdVault MENA – ذكاء إعلاني استراتيجي",
  description: "منصة B2B للذكاء الإعلاني في منطقة MENA – فكك الإعلانات الناجحة وطبّقها باحتراف",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <ThemeProvider>
          <AuthProvider>
            <ToastProvider>
              <ScrollProgress />
              {children}
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
