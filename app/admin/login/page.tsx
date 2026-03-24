"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { setAdminCookie } from "../../actions";

const VALID_PHONE = "597500500";
const VALID_OTP = "0000";

export default function AdminLoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const otpRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  // Auto-focus first OTP input on step 2
  useEffect(() => {
    if (step === 2) otpRefs[0].current?.focus();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const cleaned = phone.replace(/\s/g, "");
    if (cleaned !== VALID_PHONE) {
      setError("رقم الهاتف غير صحيح");
      return;
    }
    setStep(2);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const digit = value.slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    setError(null);
    // Auto-advance
    if (digit && index < 3) {
      otpRefs[index + 1].current?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs[index - 1].current?.focus();
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const code = otp.join("");
    if (code.length !== 4) { setError("أدخل رمز التحقق كاملاً"); return; }
    if (code !== VALID_OTP) { setError("رمز التحقق غير صحيح"); return; }
    setLoading(true);
    try {
      await setAdminCookie();
      router.refresh();
      router.push("/admin/dashboard");
    } catch {
      setError("حدث خطأ، حاول مجدداً");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#f3f5f9" }}>
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-black text-white mx-auto mb-4"
            style={{ background: "#8957f6" }}>AV</div>
          <h1 className="text-2xl font-extrabold" style={{ color: "#1c1c1e" }}>لوحة الإدارة</h1>
          <p className="text-sm mt-1" style={{ color: "#6b7280" }}>
            {step === 1 ? "أدخل رقم الهاتف المسجّل" : "أدخل رمز التحقق"}
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-8 h-1 rounded-full" style={{ background: "#8957f6" }} />
          <div className="w-8 h-1 rounded-full" style={{ background: step === 2 ? "#8957f6" : "#e5e7eb" }} />
        </div>

        <div className="rounded-2xl border p-6" style={{ background: "#ffffff", borderColor: "#e5e7eb" }}>

          {/* Step 1: Phone */}
          {step === 1 && (
            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: "#1c1c1e" }}>رقم الهاتف</label>
                <div className="flex items-center gap-2" dir="ltr">
                  <div className="px-3 py-2.5 rounded-xl border text-sm font-bold shrink-0"
                    style={{ background: "#f3f5f9", borderColor: "#e5e7eb", color: "#1c1c1e" }}>
                    +966
                  </div>
                  <input
                    type="tel"
                    required
                    maxLength={9}
                    value={phone}
                    onChange={(e) => { setPhone(e.target.value.replace(/\D/g, "")); setError(null); }}
                    placeholder="5XXXXXXXX"
                    className="flex-1 px-4 py-2.5 rounded-xl border outline-none text-sm font-mono tracking-wider"
                    style={{ background: "#ffffff", borderColor: "#e5e7eb", color: "#1c1c1e" }}
                    autoFocus
                  />
                </div>
              </div>

              {error && (
                <div className="px-3 py-2 rounded-lg text-xs font-semibold" style={{ background: "#fef2f2", color: "#dc2626" }}>
                  {error}
                </div>
              )}

              <button type="submit"
                className="w-full py-3 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90"
                style={{ background: "#8957f6" }}>
                التالي
              </button>
            </form>
          )}

          {/* Step 2: OTP */}
          {step === 2 && (
            <form onSubmit={handleOtpSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold mb-1 text-center" style={{ color: "#1c1c1e" }}>رمز التحقق</label>
                <p className="text-xs text-center mb-4" style={{ color: "#9ca3af" }}>
                  تم إرسال رمز التحقق إلى +966 {phone}
                </p>
                <div className="flex items-center justify-center gap-3" dir="ltr">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={otpRefs[i]}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      className="w-14 h-14 rounded-xl border text-center text-xl font-bold outline-none transition-all focus:border-[#8957f6] focus:ring-2 focus:ring-[#8957f6]/20"
                      style={{ background: "#ffffff", borderColor: digit ? "#8957f6" : "#e5e7eb", color: "#1c1c1e" }}
                    />
                  ))}
                </div>
              </div>

              {error && (
                <div className="px-3 py-2 rounded-lg text-xs font-semibold" style={{ background: "#fef2f2", color: "#dc2626" }}>
                  {error}
                </div>
              )}

              <button type="submit" disabled={loading}
                className="w-full py-3 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90 disabled:opacity-60"
                style={{ background: "#8957f6" }}>
                {loading ? "جارٍ التحقق..." : "تحقق"}
              </button>

              <button type="button" onClick={() => { setStep(1); setOtp(["", "", "", ""]); setError(null); }}
                className="w-full text-center text-xs font-semibold" style={{ color: "#8957f6" }}>
                تغيير رقم الهاتف
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-xs mt-4" style={{ color: "#9ca3af" }}>
          هذه الصفحة مخصصة لمشرفي المنصة فقط
        </p>
      </div>
    </div>
  );
}
