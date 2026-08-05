// @ts-nocheck
import React, { useState, useEffect } from "react";
import {
  Calendar, Users, AlertTriangle, Syringe,
  Baby, Stethoscope, ClipboardList, Search,
  MessageCircle, Upload, ChevronRight, MapPin,
  Heart
} from "lucide-react";
import { getPatients } from "../services/patientService";
import { useAuth } from "../context/AuthContext";

const ASHA = { name: "Sunita Devi", id: "ASHA-DL-2291", village: "Rampur Khera, Najafgarh Block" };

function Avatar({ name, size = 40, tone = "teal" }) {
  const initials = name.split(" ").map((n) => n[0]).slice(0, 2).join("");
  const tones = {
    teal: "bg-teal-100 text-teal-700",
    blue: "bg-blue-100 text-blue-700",
    rose: "bg-rose-100 text-rose-700",
  };
  return (
    <div style={{ width: size, height: size }} className={`rounded-full flex items-center justify-center font-semibold shrink-0 ${tones[tone]}`}>
      {initials}
    </div>
  );
}

function StatTile({ icon: Icon, label, value, tint }) {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 flex items-center gap-3">
      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${tint}`}>
        <Icon size={20} />
      </div>
      <div className="min-w-0">
        <p className="text-xl font-semibold text-slate-800 leading-none">{value}</p>
        <p className="text-xs text-slate-500 mt-1 truncate">{label}</p>
      </div>
    </div>
  );
}

export default function Home({ go }) {
  const { user } = useAuth();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPatients("rampur-khera");
        setPatients(data);
      } catch (err) {
        console.error("Home fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const highRisk = patients.filter((p) => p.riskLevel === "High").length;
  const pregnant = patients.filter((p) => p.type === "Pregnant").length;
  const chronic = patients.filter((p) => p.type === "Chronic").length;
  const children = patients.filter((p) => p.type === "Child").length;

  return (
    <div className="px-5 -mt-3 pb-6 space-y-5">
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 bg-gradient-to-br from-white to-teal-50/60">
        <div className="flex items-center gap-3">
          <Avatar name={ASHA.name} size={48} />
          <div>
            <p className="font-semibold text-slate-800">{ASHA.name}</p>
            <p className="text-xs text-slate-500">{ASHA.id} · {ASHA.village}</p>
            {user && <p className="text-[11px] text-teal-600 mt-0.5">{user.email}</p>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <StatTile icon={Users} label="Total patients" value={loading ? "..." : patients.length} tint="bg-teal-50 text-teal-600" />
        <StatTile icon={AlertTriangle} label="High risk patients" value={loading ? "..." : highRisk} tint="bg-rose-50 text-rose-600" />
        <StatTile icon={Baby} label="Pregnant women" value={loading ? "..." : pregnant} tint="bg-pink-50 text-pink-600" />
        <StatTile icon={Stethoscope} label="Chronic cases" value={loading ? "..." : chronic} tint="bg-indigo-50 text-indigo-600" />
        <StatTile icon={Syringe} label="Children" value={loading ? "..." : children} tint="bg-amber-50 text-amber-600" />
        <StatTile icon={Calendar} label="Today's visits" value={5} tint="bg-blue-50 text-blue-600" />
      </div>

      <div>
        <p className="text-base font-semibold text-slate-800 mb-3">Quick actions</p>
        <div className="grid grid-cols-4 gap-3">
          {[
            { icon: ClipboardList, label: "New visit", key: "visit" },
            { icon: Search, label: "Find patient", key: "patients" },
            { icon: MessageCircle, label: "Ask Sangini", key: "assistant" },
            { icon: Upload, label: "Scan doc", key: "ocr" },
          ].map((a) => (
            <button key={a.key} onClick={() => go(a.key)} className="flex flex-col items-center gap-1.5 active:scale-95 transition">
              <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-teal-600">
                <a.icon size={20} />
              </div>
              <span className="text-[11px] text-slate-600 font-medium text-center leading-tight">{a.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-base font-semibold text-slate-800 mb-3">Patient list</p>
        <div className="space-y-2.5">
          {patients.slice(0, 5).map((p) => (
            <div key={p.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-3.5 flex items-center gap-3">
              <Avatar name={p.name} tone={p.riskLevel === "High" ? "rose" : "blue"} />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-slate-800">{p.name}</p>
                <p className="text-xs text-slate-500">{p.age} yrs · {p.type}</p>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  p.riskLevel === "High" ? "bg-rose-50 text-rose-600" :
                  p.riskLevel === "Medium" ? "bg-amber-50 text-amber-600" :
                  "bg-teal-50 text-teal-600"
                }`}>
                  {p.riskLevel} risk
                </span>
              </div>
              <ChevronRight size={16} className="text-slate-300" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}