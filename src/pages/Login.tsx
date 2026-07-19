// @ts-nocheck
import React, { useState, useEffect } from "react";
import { Heart, Phone, ChevronRight, Loader2, ShieldCheck } from "lucide-react";
import { setupRecaptcha, sendOTP, verifyOTP } from "../services/authService";

export default function Login() {
  const [step, setStep] = useState(0);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
  return () => {
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear();
      window.recaptchaVerifier = null;
    }
  };
}, []);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (phone.length < 10) return;
    setLoading(true);
    setError("");
    try {
      setupRecaptcha("recaptcha-container");
      await sendOTP("+91" + phone);
      setStep(1);
    } catch (err) {
      setError("Failed to send OTP. Check your phone number and try again.");
      console.error(err);
    }
    setLoading(false);
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (otp.length < 6) return;
    setLoading(true);
    setError("");
    try {
      await verifyOTP(otp);
    } catch (err) {
      setError("Invalid OTP. Please try again.");
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 via-white to-blue-50 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-8 pt-10">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center shadow-lg shadow-teal-200 mb-5">
          <Heart size={42} className="text-white fill-white" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800">Sangini AI</h1>
        <p className="text-slate-500 text-sm mt-2 text-center leading-relaxed px-2">
          Empowering Every ASHA Worker,<br />Caring for Every Village.
        </p>
      </div>

      <div className="mx-5 mb-8 bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
        {step === 0 ? (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-slate-700">
                ASHA Worker Login
              </label>
              <p className="text-xs text-slate-400 mt-0.5">
                Enter your registered mobile number
              </p>
            </div>
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5">
              <Phone size={18} className="text-slate-400" />
              <span className="text-slate-500 text-sm">+91</span>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                placeholder="98765 43210"
                className="flex-1 bg-transparent outline-none text-slate-800 text-sm"
              />
            </div>
            {error && <p className="text-xs text-rose-500">{error}</p>}
            <div id="recaptcha-container"></div>
            <button
              type="submit"
              disabled={phone.length < 10 || loading}
              className="w-full bg-gradient-to-r from-teal-600 to-blue-600 text-white font-semibold rounded-2xl py-3.5 flex items-center justify-center gap-2 disabled:opacity-40"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>Send OTP <ChevronRight size={16} /></>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-slate-700">
                Enter OTP
              </label>
              <p className="text-xs text-slate-400 mt-0.5">
                Sent to +91 {phone}
              </p>
            </div>
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="• • • • • •"
              className="w-full text-center text-2xl tracking-widest bg-slate-50 border border-slate-200 rounded-2xl py-3.5 outline-none"
            />
            {error && <p className="text-xs text-rose-500">{error}</p>}
            <button
              type="submit"
              disabled={otp.length < 6 || loading}
              className="w-full bg-gradient-to-r from-teal-600 to-blue-600 text-white font-semibold rounded-2xl py-3.5 flex items-center justify-center gap-2 disabled:opacity-40"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>Verify OTP <ChevronRight size={16} /></>
              )}
            </button>
            <button
              type="button"
              onClick={() => { setStep(0); setError(""); }}
              className="w-full text-center text-xs text-slate-400 font-medium"
            >
              Change number
            </button>
          </form>
        )}
      </div>

      <div className="flex items-center justify-center gap-1.5 pb-6">
        <ShieldCheck size={12} className="text-teal-500" />
        <p className="text-center text-xs text-slate-400">
          Secured by Firebase Authentication
        </p>
      </div>
    </div>
  );
}