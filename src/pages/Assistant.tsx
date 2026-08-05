// @ts-nocheck
import React, { useState, useRef, useEffect } from "react";
import { Send, Sparkles, Loader2, ShieldCheck, RefreshCw } from "lucide-react";
import { askGemini } from "../services/geminiService";

const suggestedPrompts = [
  "A child's vaccination is overdue by 2 weeks",
  "Patient BP is 170/110, what should I do?",
  "What follow-up should I schedule for ANC patient?",
  "Child has fever of 101°F since yesterday",
  "Diabetic patient missed medicines for 3 days",
  "When should I refer a patient to PHC?",
];

export default function Assistant() {
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "Namaste! I am Sangini, your AI health assistant. Ask me about symptoms, vaccinations, follow-up planning, or any health concern from your village visits. I am here to support you.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const userText = text ?? input;
    if (!userText.trim() || loading) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userText }]);
    setLoading(true);

    try {
      const response = await askGemini(userText, history);
      setHistory(response.history);
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: response.text },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: "Sorry, I could not connect right now. Please check your internet connection and try again.",
        },
      ]);
    }
    setLoading(false);
  };

  const resetChat = () => {
    setMessages([
      {
        role: "ai",
        text: "Namaste! I am Sangini, your AI health assistant. Ask me about symptoms, vaccinations, follow-up planning, or any health concern from your village visits. I am here to support you.",
      },
    ]);
    setHistory([]);
    setInput("");
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      <div className="bg-gradient-to-r from-teal-600 to-blue-600 text-white px-5 pt-5 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles size={20} />
            <div>
              <p className="font-bold text-sm">Sangini AI Assistant</p>
              <p className="text-xs text-teal-100">Powered by Gemini AI</p>
            </div>
          </div>
          <button
            onClick={resetChat}
            className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center"
          >
            <RefreshCw size={15} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 pb-32">
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-3 flex items-start gap-2">
          <ShieldCheck size={14} className="text-amber-600 mt-0.5 shrink-0" />
          <p className="text-xs text-amber-700">
            Sangini AI provides decision-support guidance only. Always refer serious cases to your PHC doctor.
          </p>
        </div>

        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            {m.role === "user" ? (
              <div className="bg-teal-600 text-white text-sm px-4 py-2.5 rounded-2xl rounded-br-md max-w-[80%]">
                {m.text}
              </div>
            ) : (
              <div className="bg-white border border-slate-100 shadow-sm rounded-2xl rounded-bl-md max-w-[88%] px-4 py-3">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Sparkles size={13} className="text-teal-500" />
                  <span className="text-xs font-bold text-slate-800">Sangini</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">
                  {m.text}
                </p>
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-2">
              <Loader2 size={14} className="animate-spin text-teal-500" />
              <span className="text-xs text-slate-400">Sangini is thinking...</span>
            </div>
          </div>
        )}

        {messages.length === 1 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {suggestedPrompts.map((s) => (
              <button
                key={s}
                onClick={() => sendMessage(s)}
                className="text-[11px] bg-teal-50 text-teal-700 font-medium px-3 py-2 rounded-full border border-teal-100"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <div ref={endRef} />
      </div>

      <div className="fixed bottom-16 left-0 right-0 max-w-md mx-auto px-4 py-3 bg-white border-t border-slate-100">
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ask Sangini anything..."
            className="flex-1 bg-transparent outline-none text-sm py-1"
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center disabled:opacity-40"
          >
            <Send size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}