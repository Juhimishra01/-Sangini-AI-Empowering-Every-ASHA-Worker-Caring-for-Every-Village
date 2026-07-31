// @ts-nocheck
import React, { useState, useRef } from "react";
import { Upload, Camera, FileText, Loader2, CheckCircle2, X, Save } from "lucide-react";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${GEMINI_API_KEY}`;

const extractFromPrescription = async (base64Image, mimeType) => {
  const response = await fetch(GEMINI_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: `You are a medical document reader. Extract information from this prescription or health document and return ONLY a JSON object with these fields:
{
  "patientName": "",
  "date": "",
  "doctorName": "",
  "hospital": "",
  "diagnosis": "",
  "medicines": [],
  "instructions": "",
  "nextVisit": ""
}
If a field is not found, leave it empty. For medicines, list each medicine as a string. Return ONLY the JSON, no other text.`,
            },
            {
              inline_data: {
                mime_type: mimeType,
                data: base64Image,
              },
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 500,
      },
    }),
  });

  if (!response.ok) throw new Error(`API error: ${response.status}`);
  const data = await response.json();
  const text = data.candidates[0].content.parts[0].text;
  const clean = text.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
};

export default function OCR() {
  const [status, setStatus] = useState("idle");
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const fileRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;
    setError("");
    setResult(null);

    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target.result.split(",")[1];
      const mimeType = file.type;
      setPreview(e.target.result);
      setStatus("scanning");

      try {
        const extracted = await extractFromPrescription(base64, mimeType);
        setResult(extracted);
        setStatus("done");
      } catch (err) {
        setError("Could not extract information. Please try a clearer image.");
        setStatus("idle");
        console.error(err);
      }
    };
    reader.readAsDataURL(file);
  };

  const reset = () => {
    setStatus("idle");
    setPreview(null);
    setResult(null);
    setError("");
  };

  return (
    <div className="px-5 pb-6 space-y-4 mt-3">
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4">
        <p className="text-base font-semibold text-slate-800 mb-1">
          Scan prescription or health document
        </p>
        <p className="text-xs text-slate-400 mb-4">
          Upload a photo and Gemini AI will extract the information
        </p>

        {status === "idle" && (
          <button
            onClick={() => fileRef.current.click()}
            className="w-full border-2 border-dashed border-teal-200 rounded-2xl py-10 flex flex-col items-center gap-2 bg-teal-50/30 active:scale-[0.99] transition"
          >
            <div className="w-12 h-12 rounded-2xl bg-teal-100 flex items-center justify-center text-teal-600">
              <Camera size={22} />
            </div>
            <p className="text-sm font-semibold text-slate-700">
              Tap to upload image
            </p>
            <p className="text-xs text-slate-400">
              Prescription, lab report or health card
            </p>
          </button>
        )}

        {status === "scanning" && (
          <div className="py-10 flex flex-col items-center gap-3">
            <Loader2 size={28} className="animate-spin text-teal-600" />
            <p className="text-sm font-medium text-slate-600">
              Gemini AI is reading the document...
            </p>
            <p className="text-xs text-slate-400">This may take a few seconds</p>
          </div>
        )}

        {preview && status === "done" && (
          <div className="flex items-center gap-3 bg-teal-50 rounded-2xl p-3 mb-2">
            <img src={preview} className="w-12 h-12 rounded-xl object-cover" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-700">Document scanned</p>
              <p className="text-xs text-teal-600">Extraction complete</p>
            </div>
            <button onClick={reset} className="text-slate-400">
              <X size={16} />
            </button>
          </div>
        )}

        {error && (
          <p className="text-xs text-rose-500 mt-2">{error}</p>
        )}

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files[0])}
        />
      </div>

      {result && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4">
          <p className="text-base font-semibold text-slate-800 mb-3">
            Extracted information
          </p>
          <div className="space-y-2.5 text-xs">
            {[
              { l: "Patient name", v: result.patientName },
              { l: "Date", v: result.date },
              { l: "Doctor", v: result.doctorName },
              { l: "Hospital", v: result.hospital },
              { l: "Diagnosis", v: result.diagnosis },
              { l: "Next visit", v: result.nextVisit },
              { l: "Instructions", v: result.instructions },
            ].filter(r => r.v).map((row) => (
              <div key={row.l} className="flex justify-between gap-3 border-b border-slate-50 pb-2">
                <span className="text-slate-400 shrink-0 w-28">{row.l}</span>
                <span className="text-slate-700 font-medium text-right">{row.v}</span>
              </div>
            ))}

            {result.medicines && result.medicines.length > 0 && (
              <div className="flex justify-between gap-3 border-b border-slate-50 pb-2">
                <span className="text-slate-400 shrink-0 w-28">Medicines</span>
                <div className="text-right">
                  {result.medicines.map((m, i) => (
                    <p key={i} className="text-slate-700 font-medium">{m}</p>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button className="w-full mt-4 bg-teal-600 text-white text-sm font-semibold rounded-xl py-3 flex items-center justify-center gap-2 active:scale-[0.98] transition">
            <Save size={16} /> Save to patient record
          </button>
        </div>
      )}
    </div>
  );
}