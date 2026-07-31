// @ts-nocheck
import React, { useState, useEffect } from "react";
import {
  Users, AlertTriangle, Baby, Stethoscope,
  Heart, TrendingUp, Loader2, Sparkles
} from "lucide-react";
import { getVillageStats } from "../services/analyticsService";
import { generateHealthInsights } from "../services/insightsService";
import { getPatients } from "../services/patientService";

const VILLAGE = "Rampur Khera, Najafgarh Block";

function StatCard({ icon: Icon, label, value, tint }) {
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

function ProgressBar({ label, value, max, color }) {
  const pct = Math.round((value / Math.max(max, 1)) * 100);
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-slate-500">{label}</span>
        <span className="font-semibold text-slate-700">{value} / {max}</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function Village() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [insights, setInsights] = useState(null);
  const [insightsLoading, setInsightsLoading] = useState(false);

  useEffect(() => {
    const fetchInsights = async (statsData) => {
      setInsightsLoading(true);
      try {
        const patients = await getPatients("rampur-khera");
        const result = await generateHealthInsights(statsData, patients);
        if (result && result.insights) {
          setInsights(result.insights);
        } else {
          setInsights([
            { type: "urgent", title: "High risk patients", message: `${statsData.highRisk} patients are high risk.`, action: "Schedule immediate follow-up visits" },
            { type: "warning", title: "Pregnant women", message: `${statsData.pregnant} pregnant women need ANC checkups.`, action: "Confirm next ANC visit dates" },
            { type: "info", title: "Chronic cases", message: `${statsData.chronic} patients have chronic conditions.`, action: "Check medicine adherence this week" },
          ]);
        }
      } catch (err) {
        console.error("Insights error:", err);
        setInsights([
          { type: "info", title: "Village summary", message: `${statsData.total} patients registered. ${statsData.highRisk} are high risk.`, action: "Review patient records" }
        ]);
      } finally {
        setInsightsLoading(false);
      }
    };

    const fetchStats = async () => {
      try {
        const data = await getVillageStats();
        setStats(data);
        fetchInsights(data);
      } catch (err) {
        setError("Failed to load statistics.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="animate-spin text-teal-600" />
        <span className="ml-2 text-sm text-slate-500">Loading village stats...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-5 mt-3">
        <div className="bg-rose-50 text-rose-600 text-sm p-3 rounded-2xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="px-5 pb-6 space-y-4 mt-3">
      <div className="bg-gradient-to-br from-teal-600 to-blue-600 text-white rounded-3xl p-4">
        <p className="text-xs text-teal-100">Village health overview</p>
        <p className="font-bold text-lg">{VILLAGE}</p>
        <div className="grid grid-cols-2 gap-3 mt-3">
          <div>
            <p className="text-2xl font-bold">{stats.total}</p>
            <p className="text-xs text-teal-100">Total patients</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{stats.highRisk}</p>
            <p className="text-xs text-teal-100">High risk</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <StatCard icon={AlertTriangle} label="High risk patients" value={stats.highRisk} tint="bg-rose-50 text-rose-600" />
        <StatCard icon={Baby} label="Pregnant women" value={stats.pregnant} tint="bg-pink-50 text-pink-600" />
        <StatCard icon={Stethoscope} label="Chronic cases" value={stats.chronic} tint="bg-indigo-50 text-indigo-600" />
        <StatCard icon={Users} label="Children" value={stats.children} tint="bg-blue-50 text-blue-600" />
        <StatCard icon={Heart} label="Postnatal care" value={stats.postnatal} tint="bg-amber-50 text-amber-600" />
        <StatCard icon={TrendingUp} label="Medium risk" value={stats.mediumRisk} tint="bg-teal-50 text-teal-600" />
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4">
        <p className="text-base font-semibold text-slate-800 mb-4">Patient distribution</p>
        <div className="space-y-3">
          <ProgressBar label="High risk" value={stats.highRisk} max={stats.total} color="bg-rose-500" />
          <ProgressBar label="Pregnant women" value={stats.pregnant} max={stats.total} color="bg-pink-500" />
          <ProgressBar label="Chronic cases" value={stats.chronic} max={stats.total} color="bg-indigo-500" />
          <ProgressBar label="Children" value={stats.children} max={stats.total} color="bg-blue-500" />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={16} className="text-teal-500" />
          <p className="text-base font-semibold text-slate-800">AI Health Insights</p>
        </div>

        {insightsLoading && (
          <div className="flex items-center gap-2 py-4">
            <Loader2 size={16} className="animate-spin text-teal-500" />
            <span className="text-xs text-slate-400">Gemini is analyzing village health data...</span>
          </div>
        )}

        {insights && (
          <div className="space-y-3">
            {insights.map((insight, i) => (
              <div key={i} className={`rounded-2xl p-3 ${
                insight.type === "urgent" ? "bg-rose-50 border border-rose-100" :
                insight.type === "warning" ? "bg-amber-50 border border-amber-100" :
                "bg-teal-50 border border-teal-100"
              }`}>
                <p className={`text-xs font-bold mb-1 ${
                  insight.type === "urgent" ? "text-rose-600" :
                  insight.type === "warning" ? "text-amber-600" :
                  "text-teal-600"
                }`}>{insight.title}</p>
                <p className="text-xs text-slate-600">{insight.message}</p>
                {insight.action && (
                  <p className={`text-[11px] font-medium mt-1.5 ${
                    insight.type === "urgent" ? "text-rose-500" :
                    insight.type === "warning" ? "text-amber-500" :
                    "text-teal-500"
                  }`}>→ {insight.action}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}