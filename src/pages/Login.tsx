// @ts-nocheck
import React, { useState } from "react";
import { Heart, Mail, Lock, ChevronRight, Loader2, ShieldCheck } from "lucide-react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      if (err.code === "auth/user-not-found" || err.code === "auth/invalid-credential" || err.code === "auth/invalid-email")  {
        try {
          await createUserWithEmailAndPassword(auth, email, password);
        } catch (err2) {
          setError(err2.message);
        }
      } else {
        setError(err2.message);
      }
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
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-slate-700">
              ASHA Worker Login
            </label>
            <p className="text-xs text-slate-400 mt-0.5">
              Enter your email and password
            </p>
          </div>
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5">
            <Mail size={18} className="text-slate-400" />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="asha@example.com"
              type="email"
              className="flex-1 bg-transparent outline-none text-slate-800 text-sm"
            />
          </div>
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5">
            <Lock size={18} className="text-slate-400" />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              type="password"
              className="flex-1 bg-transparent outline-none text-slate-800 text-sm"
            />
          </div>
          {error && <p className="text-xs text-rose-500">{error}</p>}
          <button
            type="submit"
            disabled={!email || !password || loading}
            className="w-full bg-gradient-to-r from-teal-600 to-blue-600 text-white font-semibold rounded-2xl py-3.5 flex items-center justify-center gap-2 disabled:opacity-40"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <>Login <ChevronRight size={16} /></>
            )}
          </button>
        </form>
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