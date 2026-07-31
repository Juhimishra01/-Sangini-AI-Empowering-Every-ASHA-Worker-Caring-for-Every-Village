// @ts-nocheck
import React, { useState } from "react";
import { Search, ChevronRight, ChevronLeft, AlertTriangle, MapPin, Loader2 } from "lucide-react";
import { usePatients } from "../hooks/usePatients";

function Avatar({ name, size = 40, tone = "teal" }) {
  const initials = name.split(" ").map((n) => n[0]).slice(0, 2).join("");
  const tones = {
    teal: "bg-teal-100 text-teal-700",
    blue: "bg-blue-100 text-blue-700",
    rose: "bg-rose-100 text-rose-700",
  };
  return (
    <div
      style={{ width: size, height: size }}
      className={`rounded-full flex items-center justify-center font-semibold shrink-0 ${tones[tone]}`}
    >
      {initials}
    </div>
  );
}

function PatientProfile({ patient: p, onBack }) {
  return (
    <div className="px-5 pb-6 space-y-4">
      <button onClick={onBack} className="flex items-center gap-1 text-sm text-slate-500 font-medium mt-3">
        <ChevronLeft size={16} /> Back to patients
      </button>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 flex items-center gap-3">
        <Avatar name={p.name} size={52} tone="blue" />
        <div>
          <p className="font-bold text-slate-800">{p.name}</p>
          <p className="text-xs text-slate-500">{p.age} yrs · {p.gender} · {p.village}</p>
          <p className="text-[11px] text-teal-600 font-semibold mt-0.5">{p.type}</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4">
        <p className="text-base font-semibold text-slate-800 mb-3">Latest vitals</p>
        <div className="grid grid-cols-4 gap-2 text-center">
          {[
            { l: "BP", v: p.vitals?.bp || "—" },
            { l: "Sugar", v: p.vitals?.sugar || "—" },
            { l: "Temp", v: p.vitals?.temp || "—" },
            { l: "Weight", v: p.vitals?.weight || "—" },
          ].map((v) => (
            <div key={v.l} className="bg-slate-50 rounded-xl py-2.5">
              <p className="text-[10px] text-slate-400 font-medium">{v.l}</p>
              <p className="text-xs font-bold text-slate-800 mt-0.5">{v.v}</p>
            </div>
          ))}
        </div>
      </div>

      {p.conditions && p.conditions.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4">
          <p className="text-base font-semibold text-slate-800 mb-2">Conditions</p>
          <div className="flex flex-wrap gap-2">
            {p.conditions.map((c, i) => (
              <span key={i} className="text-xs bg-teal-50 text-teal-700 px-3 py-1 rounded-full border border-teal-100">
                {c}
              </span>
            ))}
          </div>
        </div>
      )}

      {p.pregnancy && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4">
          <p className="text-base font-semibold text-slate-800 mb-2">Pregnancy tracking</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-pink-50 rounded-xl p-2.5">
              <p className="text-pink-400 font-medium">LMP</p>
              <p className="font-semibold text-slate-800">{p.pregnancy.lmp}</p>
            </div>
            <div className="bg-pink-50 rounded-xl p-2.5">
              <p className="text-pink-400 font-medium">EDD</p>
              <p className="font-semibold text-slate-800">{p.pregnancy.edd}</p>
            </div>
            <div className="bg-pink-50 rounded-xl p-2.5">
              <p className="text-pink-400 font-medium">Trimester</p>
              <p className="font-semibold text-slate-800">{p.pregnancy.trimester}rd</p>
            </div>
            <div className="bg-pink-50 rounded-xl p-2.5">
              <p className="text-pink-400 font-medium">ANC visits</p>
              <p className="font-semibold text-slate-800">{p.pregnancy.ancVisits}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-base font-semibold text-slate-800">Risk level</p>
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
            p.riskLevel === "High" ? "bg-rose-50 text-rose-600" :
            p.riskLevel === "Medium" ? "bg-amber-50 text-amber-600" :
            "bg-teal-50 text-teal-600"
          }`}>
            {p.riskLevel}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Patients() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const { patients, loading, error } = usePatients();

  const filtered = patients.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );

  if (selected) return <PatientProfile patient={selected} onBack={() => setSelected(null)} />;

  return (
    <div className="px-5 pb-6 space-y-4 mt-3">
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-1.5">
        <div className="flex items-center gap-2 px-3 py-2.5">
          <Search size={18} className="text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search patient by name..."
            className="flex-1 bg-transparent outline-none text-sm"
          />
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-10">
          <Loader2 size={24} className="animate-spin text-teal-600" />
          <span className="ml-2 text-sm text-slate-500">Loading patients...</span>
        </div>
      )}

      {error && (
        <div className="bg-rose-50 text-rose-600 text-sm p-3 rounded-2xl flex items-center gap-2">
          <AlertTriangle size={16} />
          Failed to load patients. Please try again.
        </div>
      )}

      <div className="space-y-2.5">
        {filtered.map((p) => (
          <button
            key={p.id}
            onClick={() => setSelected(p)}
            className="w-full bg-white rounded-3xl border border-slate-100 shadow-sm p-3.5 flex items-center gap-3 text-left active:scale-[0.99] transition"
          >
            <Avatar
              name={p.name}
              tone={p.riskLevel === "High" ? "rose" : "blue"}
            />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-slate-800">{p.name}</p>
              <p className="text-xs text-slate-500">{p.age} yrs · {p.gender} · {p.village}</p>
              <p className="text-[11px] text-teal-600 font-medium mt-0.5">{p.type}</p>
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                p.riskLevel === "High" ? "bg-rose-50 text-rose-600" :
                p.riskLevel === "Medium" ? "bg-amber-50 text-amber-600" :
                "bg-teal-50 text-teal-600"
              }`}>
                {p.riskLevel} risk
              </span>
              <ChevronRight size={16} className="text-slate-300" />
            </div>
          </button>
        ))}

        {!loading && filtered.length === 0 && (
          <p className="text-center text-sm text-slate-400 py-10">
            No patients found for "{query}"
          </p>
        )}
      </div>
    </div>
  );
}