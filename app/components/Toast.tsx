"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

type ToastType = { id: number; message: string };

const ToastContext = createContext<{ show: (msg: string) => void }>({ show: () => {} });

export function useToast() { return useContext(ToastContext); }

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastType[]>([]);

  const show = useCallback((message: string) => {
    const id = Date.now();
    setToasts((t) => [...t, { id, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2500);
  }, []);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[99999] flex flex-col gap-2 items-center pointer-events-none">
        {toasts.map((t) => (
          <div key={t.id} className="px-5 py-2.5 rounded-xl text-sm font-bold text-white shadow-lg pointer-events-auto"
            style={{ background: "#2563eb", animation: "slideIn 0.3s ease" }}>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
