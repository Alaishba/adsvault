"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "../lib/supabase/client";

export default function Footer() {
  const [siteLogo, setSiteLogo] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.from("site_settings").select("value").eq("key", "site_logo").single()
      .then(({ data }: { data: { value: string } | null }) => { setSiteLogo(data?.value || "/logo.svg"); })
      .catch(() => { setSiteLogo("/logo.svg"); });
  }, []);

  return (
    <footer className="bg-[#ced3de]/20 border-t border-[#ced3de]/40">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* RIGHT column — Logo + copyright */}
          <div className="flex flex-col gap-3">
            <Link href="/" className="flex items-center gap-2.5">
              {siteLogo ? (
                <img src={siteLogo} alt="Molhm" className="h-24 w-24 rounded-lg object-contain" />
              ) : (
                <div style={{width: 96, height: 96}} />
              )}
              <span className="font-black text-base text-white">Molhm</span>
            </Link>
            <p className="text-sm text-black">© 2026 بندر. جميع الحقوق محفوظة</p>
          </div>

          {/* CENTER-RIGHT column — Quick links */}
          <div className="flex flex-col gap-2">
            <p className="text-sm font-bold text-black mb-1">روابط سريعة</p>
            <Link href="/terms" className="text-sm text-black hover:text-slate-900 transition-colors">سياسة الخصوصية</Link>
            <Link href="/terms" className="text-sm text-black hover:text-slate-900 transition-colors">الشروط والأحكام</Link>
          </div>

          {/* CENTER-LEFT column — Important links */}
          <div className="flex flex-col gap-2">
            <p className="text-sm font-bold text-black mb-1">روابط مهمة</p>
            <Link href="/removal" className="text-sm text-black hover:text-slate-900 transition-colors">طلبات إزالة المحتوى</Link>
            <Link href="/terms" className="text-sm text-black hover:text-slate-900 transition-colors">دعم فني/تقني</Link>
          </div>

          {/* LEFT column — Social + Contact */}
          <div className="flex flex-col gap-4">
            {/* Social icons */}
            <div className="flex gap-2">
              {/* Twitter/X */}
              <a href="#" className="w-7 h-7 rounded-full bg-[#ced3de]/60 flex items-center justify-center hover:bg-[#ced3de] transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-black">
                  <path d="M4 4l11.733 16h4.267l-11.733 -16z" /><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
                </svg>
              </a>
              {/* Instagram */}
              <a href="#" className="w-7 h-7 rounded-full bg-[#ced3de]/60 flex items-center justify-center hover:bg-[#ced3de] transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-black">
                  <rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
                </svg>
              </a>
              {/* LinkedIn */}
              <a href="#" className="w-7 h-7 rounded-full bg-[#ced3de]/60 flex items-center justify-center hover:bg-[#ced3de] transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-black">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" />
                </svg>
              </a>
              {/* TikTok */}
              <a href="#" className="w-7 h-7 rounded-full bg-[#ced3de]/60 flex items-center justify-center hover:bg-[#ced3de] transition-colors">
                <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14" className="text-black">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.16 8.16 0 0 0 4.77 1.52V6.75a4.85 4.85 0 0 1-1-.06z"/>
                </svg>
              </a>
            </div>

            {/* Contact info */}
            <div className="flex flex-col gap-1">
              <p className="text-sm text-black">+966 XX XXX XXXX</p>
              <p className="text-sm text-black">hello@adsvault.sa</p>
            </div>

            {/* WhatsApp button */}
            <a href="https://wa.me/966XXXXXXXXX" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-[#25D366]/20 border border-[#25D366]/40 text-sm text-black px-3 py-1 rounded-full hover:bg-[#25D366]/30 transition-colors w-fit">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="#25D366" stroke="none">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.955 9.955 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"/>
              </svg>
              واتساب سريع
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
