// @ts-nocheck
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import React, { useState, useRef, useEffect } from 'react';
import {
  Heart,
  Home,
  Users,
  Calendar,
  Activity,
  Bell,
  Search,
  Mic,
  MicOff,
  Plus,
  ChevronRight,
  ChevronLeft,
  Baby,
  Syringe,
  Stethoscope,
  ClipboardList,
  MessageCircle,
  BarChart3,
  Upload,
  LogOut,
  X,
  CheckCircle2,
  AlertTriangle,
  Thermometer,
  Droplet,
  Weight,
  FileText,
  Send,
  Sparkles,
  Clock,
  MapPin,
  Phone,
  ShieldCheck,
  TrendingUp,
  ChevronDown,
  Camera,
  User,
  Loader2,
} from 'lucide-react';

/* ---------------------------------- DATA ---------------------------------- */

const VILLAGE = 'Rampur Khera, Najafgarh Block';

const ASHA = {
  name: 'Sunita Devi',
  id: 'ASHA-DL-2291',
  village: VILLAGE,
  phone: '+91 98xxx xx291',
};

const todaysVisits = [
  {
    id: 1,
    name: 'Kamla Bai',
    age: 62,
    type: 'Chronic Care',
    reason: 'Diabetes follow-up',
    time: '9:30 AM',
    priority: 'high',
    address: 'Ward 3, near Hanuman Mandir',
  },
  {
    id: 2,
    name: 'Reema (W/o Suresh)',
    age: 24,
    type: 'ANC',
    reason: '7th month checkup',
    time: '11:00 AM',
    priority: 'medium',
    address: 'Ward 1',
  },
  {
    id: 3,
    name: 'Aarav',
    age: 1,
    type: 'Child Health',
    reason: 'Vaccination - Measles 2nd dose',
    time: '12:30 PM',
    priority: 'high',
    address: 'Ward 2',
  },
  {
    id: 4,
    name: 'Mohan Lal',
    age: 70,
    type: 'Chronic Care',
    reason: 'BP monitoring',
    time: '2:00 PM',
    priority: 'medium',
    address: 'Ward 4',
  },
  {
    id: 5,
    name: 'Sita Kumari',
    age: 29,
    type: 'PNC',
    reason: '10-day postnatal check',
    time: '4:00 PM',
    priority: 'high',
    address: 'Ward 1',
  },
];

const patientsData = [
  {
    id: 'P001',
    name: 'Kamla Bai',
    age: 62,
    gender: 'Female',
    phone: '98xxx10231',
    village: 'Ward 3',
    type: 'Chronic - Diabetes & Hypertension',
    vitals: {
      bp: '172/108',
      sugar: '240 mg/dL',
      temp: '98.4°F',
      weight: '58 kg',
    },
    history: [
      {
        date: '12 Jun 2026',
        note: 'BP elevated (168/104). Advised salt reduction, scheduled follow-up.',
        by: 'Sunita Devi',
      },
      {
        date: '29 May 2026',
        note: 'Sugar 210 mg/dL fasting. Medicine adherence confirmed.',
        by: 'Sunita Devi',
      },
      {
        date: '10 May 2026',
        note: 'Routine chronic care visit. Stable vitals.',
        by: 'Sunita Devi',
      },
    ],
    chronic: {
      condition: 'Type 2 Diabetes + Hypertension',
      since: '2019',
      lastHbA1c: '8.2%',
      risk: 'High',
    },
  },
  {
    id: 'P002',
    name: 'Reema Devi',
    age: 24,
    gender: 'Female',
    phone: '98xxx55214',
    village: 'Ward 1',
    type: 'Pregnant - ANC',
    vitals: { bp: '118/76', sugar: '—', temp: '98.6°F', weight: '61 kg' },
    history: [
      {
        date: '15 Jun 2026',
        note: '6 month ANC visit. Hb 10.8 g/dL, IFA tablets given.',
        by: 'Sunita Devi',
      },
      {
        date: '20 May 2026',
        note: '5 month ANC visit. Fetal movement normal.',
        by: 'Sunita Devi',
      },
    ],
    pregnancy: {
      lmp: '2026-01-02',
      edd: '2026-10-09',
      trimester: 3,
      ancVisits: 4,
      riskFlags: ['Mild anemia'],
    },
  },
  {
    id: 'P003',
    name: 'Aarav Sharma',
    age: 1,
    gender: 'Male',
    phone: '98xxx88012',
    village: 'Ward 2',
    type: 'Child Health',
    vitals: { bp: '—', sugar: '—', temp: '98.2°F', weight: '9.1 kg' },
    history: [
      {
        date: '01 Jun 2026',
        note: 'Growth monitoring - weight on track. MR 1st dose given.',
        by: 'Sunita Devi',
      },
    ],
    vaccination: [
      { name: 'BCG', due: 'Birth', status: 'done' },
      { name: 'OPV-0', due: 'Birth', status: 'done' },
      { name: 'Penta 1-3', due: '6/10/14 wks', status: 'done' },
      { name: 'Measles-Rubella 1', due: '9 months', status: 'done' },
      { name: 'Measles-Rubella 2', due: '16-24 months', status: 'overdue' },
      { name: 'Vitamin A 2nd dose', due: '18 months', status: 'upcoming' },
    ],
  },
  {
    id: 'P004',
    name: 'Mohan Lal',
    age: 70,
    gender: 'Male',
    phone: '98xxx33890',
    village: 'Ward 4',
    type: 'Chronic - Hypertension',
    vitals: {
      bp: '164/100',
      sugar: '118 mg/dL',
      temp: '98.0°F',
      weight: '67 kg',
    },
    history: [
      {
        date: '18 Jun 2026',
        note: 'BP still high despite medication. Referred to PHC for review.',
        by: 'Sunita Devi',
      },
    ],
    chronic: { condition: 'Hypertension', since: '2015', risk: 'High' },
  },
];

const villageStats = {
  totalHouseholds: 318,
  totalPopulation: 1542,
  vaccinationCoverage: 87,
  pendingFollowUps: 14,
  highRiskPatients: 9,
  pregnantWomen: 12,
  childrenUnder5: 64,
  institutionalDeliveries: 96,
  chronicPatients: 41,
};

const notificationsData = [
  {
    id: 1,
    type: 'vaccine',
    title: 'Aarav (1yr) - MR 2nd dose overdue',
    sub: 'Overdue by 6 days · Ward 2',
    time: 'Today',
    urgent: true,
  },
  {
    id: 2,
    type: 'followup',
    title: 'Kamla Bai - BP recheck due',
    sub: 'Last reading 172/108 · Ward 3',
    time: 'Today',
    urgent: true,
  },
  {
    id: 3,
    type: 'anc',
    title: 'Reema Devi - ANC 7th month visit',
    sub: 'Scheduled today, 11:00 AM',
    time: 'Today',
    urgent: false,
  },
  {
    id: 4,
    type: 'medicine',
    title: 'Mohan Lal - medicine adherence check',
    sub: 'BP medication · Ward 4',
    time: 'Tomorrow',
    urgent: false,
  },
  {
    id: 5,
    type: 'pnc',
    title: 'Sita Kumari - 10 day PNC checkup',
    sub: 'Postnatal home visit',
    time: 'Today',
    urgent: false,
  },
  {
    id: 6,
    type: 'vaccine',
    title: '5 children due for Penta-2 this week',
    sub: 'Wards 1, 2 and 3',
    time: 'This week',
    urgent: false,
  },
];

/* ------------------------------- UI HELPERS ------------------------------- */

const priorityColor = (p) =>
  p === 'high'
    ? 'bg-rose-50 text-rose-600 border-rose-200'
    : p === 'medium'
    ? 'bg-amber-50 text-amber-600 border-amber-200'
    : 'bg-teal-50 text-teal-600 border-teal-200';

function Card({ children, className = '' }) {
  return (
    <div
      className={`bg-white rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/50 ${className}`}
    >
      {children}
    </div>
  );
}

function StatTile({ icon: Icon, label, value, tint }) {
  return (
    <Card className="p-4 flex items-center gap-3">
      <div
        className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${tint}`}
      >
        <Icon size={20} />
      </div>
      <div className="min-w-0">
        <p className="text-xl font-semibold text-slate-800 leading-none">
          {value}
        </p>
        <p className="text-xs text-slate-500 mt-1 truncate">{label}</p>
      </div>
    </Card>
  );
}

function SectionHeader({ title, action }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-base font-semibold text-slate-800">{title}</h2>
      {action}
    </div>
  );
}

function Avatar({ name, size = 40, tone = 'teal' }) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('');
  const tones = {
    teal: 'bg-teal-100 text-teal-700',
    blue: 'bg-blue-100 text-blue-700',
    rose: 'bg-rose-100 text-rose-700',
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

/* ------------------------------- TOP / NAV -------------------------------- */

function TopBar({ onNotif, onLogout, unread }) {
  return (
    <div className="sticky top-0 z-30 bg-gradient-to-r from-teal-600 to-blue-600 text-white px-5 pt-5 pb-6 rounded-b-[28px] shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
            <Heart size={18} className="fill-white" />
          </div>
          <div>
            <p className="text-sm font-bold leading-none">Sangini AI</p>
            <p className="text-[11px] text-teal-50/90 mt-0.5">{VILLAGE}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onNotif}
            className="relative w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center active:scale-95 transition"
          >
            <Bell size={17} />
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {unread}
              </span>
            )}
          </button>
          <button
            onClick={onLogout}
            className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center active:scale-95 transition"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

const NAV_ITEMS = [
  { key: 'home', label: 'Home', icon: Home },
  { key: 'visit', label: 'Record', icon: ClipboardList },
  { key: 'patients', label: 'Patients', icon: Users },
  { key: 'assistant', label: 'Sangini', icon: MessageCircle },
  { key: 'village', label: 'Village', icon: BarChart3 },
];

function BottomNav({ active, setActive }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-slate-100 px-2 py-2 flex justify-around max-w-md mx-auto shadow-[0_-4px_16px_rgba(0,0,0,0.04)]">
      {NAV_ITEMS.map((item) => {
        const isActive = active === item.key;
        return (
          <button
            key={item.key}
            onClick={() => setActive(item.key)}
            className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-2xl transition-all ${
              isActive ? 'text-teal-600' : 'text-slate-400'
            }`}
          >
            <div
              className={`w-10 h-7 rounded-full flex items-center justify-center transition-all ${
                isActive ? 'bg-teal-50' : ''
              }`}
            >
              <item.icon size={18} strokeWidth={isActive ? 2.4 : 2} />
            </div>
            <span
              className={`text-[10px] ${
                isActive ? 'font-semibold' : 'font-medium'
              }`}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* --------------------------------- LOGIN ---------------------------------- */

function LoginScreen({ onLogin }) {
  const [step, setStep] = useState(0); // 0 phone, 1 otp
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const submitPhone = (e) => {
    e.preventDefault();
    if (phone.length < 10) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(1);
    }, 900);
  };

  const submitOtp = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin();
    }, 900);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 via-white to-blue-50 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-8 pt-10">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center shadow-lg shadow-teal-200 mb-5">
          <Heart size={42} className="text-white fill-white" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800">Sangini AI</h1>
        <p className="text-slate-500 text-sm mt-2 text-center leading-relaxed px-2">
          Empowering Every ASHA Worker,
          <br />
          Caring for Every Village.
        </p>
      </div>

      <Card className="mx-5 mb-8 p-6">
        {step === 0 ? (
          <form onSubmit={submitPhone} className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-slate-700">
                ASHA Worker Login
              </label>
              <p className="text-xs text-slate-400 mt-0.5">
                Enter your registered mobile number
              </p>
            </div>
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 focus-within:border-teal-400 transition">
              <Phone size={18} className="text-slate-400" />
              <span className="text-slate-500 text-sm">+91</span>
              <input
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))
                }
                placeholder="98765 43210"
                className="flex-1 bg-transparent outline-none text-slate-800 text-sm tracking-wide"
              />
            </div>
            <button
              type="submit"
              disabled={phone.length < 10 || loading}
              className="w-full bg-gradient-to-r from-teal-600 to-blue-600 text-white font-semibold rounded-2xl py-3.5 flex items-center justify-center gap-2 disabled:opacity-40 active:scale-[0.98] transition"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  Send OTP <ChevronRight size={16} />
                </>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={submitOtp} className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-slate-700">
                Enter OTP
              </label>
              <p className="text-xs text-slate-400 mt-0.5">
                Sent to +91 {phone} (demo: any 4 digits)
              </p>
            </div>
            <input
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))
              }
              placeholder="• • • •"
              className="w-full text-center text-2xl tracking-[0.6em] bg-slate-50 border border-slate-200 rounded-2xl py-3.5 outline-none focus:border-teal-400 transition"
            />
            <button
              type="submit"
              disabled={otp.length < 4 || loading}
              className="w-full bg-gradient-to-r from-teal-600 to-blue-600 text-white font-semibold rounded-2xl py-3.5 flex items-center justify-center gap-2 disabled:opacity-40 active:scale-[0.98] transition"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  Login <ChevronRight size={16} />
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => setStep(0)}
              className="w-full text-center text-xs text-slate-400 font-medium"
            >
              Change number
            </button>
          </form>
        )}
      </Card>
      <p className="text-center text-[11px] text-slate-400 pb-6">
        A digital companion built for India's frontline health workers
      </p>
    </div>
  );
}

/* --------------------------------- HOME ----------------------------------- */

function HomeScreen({ go, openNotif }) {
  const highPriority = todaysVisits.filter((v) => v.priority === 'high').length;
  return (
    <div className="px-5 -mt-3 pb-6 space-y-5">
      <Card className="p-4 bg-gradient-to-br from-white to-teal-50/60">
        <div className="flex items-center gap-3">
          <Avatar name={ASHA.name} size={48} />
          <div>
            <p className="font-semibold text-slate-800">{ASHA.name}</p>
            <p className="text-xs text-slate-500">
              {ASHA.id} · {ASHA.village}
            </p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <StatTile
          icon={Calendar}
          label="Visits today"
          value={todaysVisits.length}
          tint="bg-teal-50 text-teal-600"
        />
        <StatTile
          icon={Users}
          label="Households assigned"
          value={villageStats.totalHouseholds}
          tint="bg-blue-50 text-blue-600"
        />
        <StatTile
          icon={AlertTriangle}
          label="High-priority follow-ups"
          value={highPriority + 5}
          tint="bg-rose-50 text-rose-600"
        />
        <StatTile
          icon={Syringe}
          label="Children due vaccination"
          value={7}
          tint="bg-amber-50 text-amber-600"
        />
        <StatTile
          icon={Baby}
          label="Pregnant women - checkups"
          value={villageStats.pregnantWomen}
          tint="bg-pink-50 text-pink-600"
        />
        <StatTile
          icon={Stethoscope}
          label="Elderly - chronic care"
          value={villageStats.chronicPatients}
          tint="bg-indigo-50 text-indigo-600"
        />
      </div>

      <div>
        <SectionHeader title="Quick actions" />
        <div className="grid grid-cols-4 gap-3">
          {[
            { icon: ClipboardList, label: 'New visit', key: 'visit' },
            { icon: Search, label: 'Find patient', key: 'patients' },
            { icon: MessageCircle, label: 'Ask Sangini', key: 'assistant' },
            { icon: Upload, label: 'Scan doc', key: 'ocr' },
          ].map((a) => (
            <button
              key={a.key}
              onClick={() => go(a.key)}
              className="flex flex-col items-center gap-1.5 active:scale-95 transition"
            >
              <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-teal-600">
                <a.icon size={20} />
              </div>
              <span className="text-[11px] text-slate-600 font-medium text-center leading-tight">
                {a.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <SectionHeader
          title="Today's home visits"
          action={
            <button
              onClick={openNotif}
              className="text-xs font-semibold text-teal-600 flex items-center gap-0.5"
            >
              Notifications <ChevronRight size={14} />
            </button>
          }
        />
        <div className="space-y-2.5">
          {todaysVisits.map((v) => (
            <Card key={v.id} className="p-3.5 flex items-center gap-3">
              <Avatar
                name={v.name}
                tone={v.priority === 'high' ? 'rose' : 'blue'}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-sm text-slate-800 truncate">
                    {v.name}
                  </p>
                  <span className="text-[11px] text-slate-400 shrink-0 ml-2">
                    {v.time}
                  </span>
                </div>
                <p className="text-xs text-slate-500 truncate">{v.reason}</p>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${priorityColor(
                      v.priority
                    )}`}
                  >
                    {v.priority === 'high' ? 'High priority' : 'Routine'}
                  </span>
                  <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                    <MapPin size={10} /> {v.address.split(',')[0]}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ----------------------------- RECORD VISIT -------------------------------- */

function RecordVisitScreen() {
  const [patientName, setPatientName] = useState('');
  const [age, setAge] = useState('');
  const [visitType, setVisitType] = useState('Chronic Care');
  const [vitals, setVitals] = useState({
    bp: '',
    sugar: '',
    temp: '',
    weight: '',
  });
  const [symptoms, setSymptoms] = useState('');
  const [recording, setRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [saved, setSaved] = useState(false);
  const recTimer = useRef(null);

  const sampleTranscripts = [
    'Patient reports mild dizziness in the morning. No chest pain. Appetite is normal. Family says medicines are being taken regularly.',
    'Mother reports child has had mild fever since yesterday evening, around 100 degrees. Eating and playing normally otherwise.',
    'Patient feels tired easily, slight swelling in feet noticed in the evening. No breathlessness at rest.',
  ];

  const toggleRecording = () => {
    if (recording) {
      setRecording(false);
      clearTimeout(recTimer.current);
      setTranscribing(true);
      setTimeout(() => {
        setTranscribing(false);
        const t =
          sampleTranscripts[
            Math.floor(Math.random() * sampleTranscripts.length)
          ];
        setSymptoms((s) => (s ? s + ' ' + t : t));
      }, 1400);
    } else {
      setRecording(true);
      recTimer.current = setTimeout(() => toggleRecording(), 3500);
    }
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2400);
    setPatientName('');
    setAge('');
    setVitals({ bp: '', sugar: '', temp: '', weight: '' });
    setSymptoms('');
  };

  return (
    <div className="px-5 -mt-3 pb-28 space-y-5">
      <Card className="p-4">
        <SectionHeader title="Patient details" />
        <div className="space-y-3">
          <input
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            placeholder="Patient full name"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-teal-400 transition"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              value={age}
              onChange={(e) => setAge(e.target.value.replace(/\D/g, ''))}
              placeholder="Age"
              className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-teal-400 transition"
            />
            <select
              value={visitType}
              onChange={(e) => setVisitType(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-sm outline-none focus:border-teal-400 transition"
            >
              <option>Chronic Care</option>
              <option>ANC</option>
              <option>PNC</option>
              <option>Child Health</option>
              <option>General</option>
            </select>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <SectionHeader title="Vitals" />
        <div className="grid grid-cols-2 gap-3">
          {[
            {
              key: 'bp',
              label: 'Blood pressure',
              placeholder: '120/80',
              icon: Activity,
            },
            {
              key: 'sugar',
              label: 'Blood sugar',
              placeholder: 'mg/dL',
              icon: Droplet,
            },
            {
              key: 'temp',
              label: 'Temperature',
              placeholder: '°F',
              icon: Thermometer,
            },
            { key: 'weight', label: 'Weight', placeholder: 'kg', icon: Weight },
          ].map((f) => (
            <div
              key={f.key}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5"
            >
              <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                <f.icon size={13} />
                <span className="text-[11px] font-medium">{f.label}</span>
              </div>
              <input
                value={vitals[f.key]}
                onChange={(e) =>
                  setVitals({ ...vitals, [f.key]: e.target.value })
                }
                placeholder={f.placeholder}
                className="bg-transparent outline-none text-sm font-semibold text-slate-800 w-full"
              />
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-4">
        <SectionHeader title="Observations & symptoms" />
        <textarea
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          rows={4}
          placeholder="Type or use voice note to describe symptoms and observations..."
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-teal-400 transition resize-none"
        />
        <button
          onClick={toggleRecording}
          disabled={transcribing}
          className={`mt-3 w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition ${
            recording
              ? 'bg-rose-50 text-rose-600 border border-rose-200'
              : 'bg-teal-50 text-teal-700 border border-teal-200'
          }`}
        >
          {transcribing ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Transcribing voice
              note...
            </>
          ) : recording ? (
            <>
              <MicOff size={16} className="animate-pulse" /> Listening... tap to
              stop
            </>
          ) : (
            <>
              <Mic size={16} /> Record voice note
            </>
          )}
        </button>
      </Card>

      <button
        onClick={handleSave}
        disabled={!patientName}
        className="w-full bg-gradient-to-r from-teal-600 to-blue-600 text-white font-semibold rounded-2xl py-4 flex items-center justify-center gap-2 disabled:opacity-40 active:scale-[0.98] transition shadow-md shadow-teal-200"
      >
        <CheckCircle2 size={18} /> Save visit
      </button>

      {saved && (
        <div className="fixed bottom-24 left-5 right-5 max-w-md mx-auto bg-slate-900 text-white text-sm font-medium px-4 py-3 rounded-2xl flex items-center gap-2 shadow-lg z-40">
          <CheckCircle2 size={16} className="text-teal-400" /> Visit saved
          successfully
        </div>
      )}
    </div>
  );
}

/* ------------------------------- PATIENTS ---------------------------------- */

function PatientsScreen() {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);

  const filtered = patientsData.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );

  if (selected)
    return (
      <PatientProfile patient={selected} onBack={() => setSelected(null)} />
    );

  return (
    <div className="px-5 -mt-3 pb-6 space-y-4">
      <Card className="p-1.5">
        <div className="flex items-center gap-2 px-3 py-2.5">
          <Search size={18} className="text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search patient by name..."
            className="flex-1 bg-transparent outline-none text-sm"
          />
        </div>
      </Card>

      <div className="space-y-2.5">
        {filtered.map((p) => (
          <Card key={p.id} className="p-3.5 flex items-center gap-3">
            <button
              onClick={() => setSelected(p)}
              className="flex items-center gap-3 w-full text-left active:scale-[0.99] transition"
            >
              <Avatar
                name={p.name}
                tone={p.type.includes('Pregnant') ? 'rose' : 'blue'}
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-slate-800">{p.name}</p>
                <p className="text-xs text-slate-500">
                  {p.age} yrs · {p.gender} · {p.village}
                </p>
                <p className="text-[11px] text-teal-600 font-medium mt-0.5">
                  {p.type}
                </p>
              </div>
              <ChevronRight size={18} className="text-slate-300" />
            </button>
          </Card>
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-sm text-slate-400 py-10">
            No patients found for "{query}"
          </p>
        )}
      </div>
    </div>
  );
}

function PatientProfile({ patient: p, onBack }) {
  return (
    <div className="px-5 -mt-3 pb-6 space-y-4">
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-sm text-slate-500 font-medium"
      >
        <ChevronLeft size={16} /> Back to patients
      </button>

      <Card className="p-4 flex items-center gap-3">
        <Avatar name={p.name} size={52} tone="blue" />
        <div>
          <p className="font-bold text-slate-800">{p.name}</p>
          <p className="text-xs text-slate-500">
            {p.age} yrs · {p.gender} · {p.village}
          </p>
          <p className="text-[11px] text-teal-600 font-semibold mt-0.5">
            {p.type}
          </p>
        </div>
      </Card>

      <Card className="p-4">
        <SectionHeader title="Latest vitals" />
        <div className="grid grid-cols-4 gap-2 text-center">
          {[
            { l: 'BP', v: p.vitals.bp },
            { l: 'Sugar', v: p.vitals.sugar },
            { l: 'Temp', v: p.vitals.temp },
            { l: 'Weight', v: p.vitals.weight },
          ].map((v) => (
            <div key={v.l} className="bg-slate-50 rounded-xl py-2.5">
              <p className="text-[10px] text-slate-400 font-medium">{v.l}</p>
              <p className="text-xs font-bold text-slate-800 mt-0.5">{v.v}</p>
            </div>
          ))}
        </div>
      </Card>

      {p.pregnancy && (
        <Card className="p-4">
          <SectionHeader title="Pregnancy tracking" />
          <div className="grid grid-cols-2 gap-2 text-xs mb-2">
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
              <p className="font-semibold text-slate-800">
                {p.pregnancy.trimester}rd
              </p>
            </div>
            <div className="bg-pink-50 rounded-xl p-2.5">
              <p className="text-pink-400 font-medium">ANC visits</p>
              <p className="font-semibold text-slate-800">
                {p.pregnancy.ancVisits}
              </p>
            </div>
          </div>
          {p.pregnancy.riskFlags.length > 0 && (
            <div className="flex items-center gap-1.5 bg-amber-50 text-amber-700 text-xs font-medium px-3 py-2 rounded-xl">
              <AlertTriangle size={14} /> {p.pregnancy.riskFlags.join(', ')}
            </div>
          )}
        </Card>
      )}

      {p.vaccination && (
        <Card className="p-4">
          <SectionHeader title="Vaccination record" />
          <div className="space-y-2">
            {p.vaccination.map((v, i) => (
              <div
                key={i}
                className="flex items-center justify-between text-xs"
              >
                <div>
                  <p className="font-semibold text-slate-700">{v.name}</p>
                  <p className="text-slate-400">{v.due}</p>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-full font-semibold text-[10px] ${
                    v.status === 'done'
                      ? 'bg-teal-50 text-teal-600'
                      : v.status === 'overdue'
                      ? 'bg-rose-50 text-rose-600'
                      : 'bg-amber-50 text-amber-600'
                  }`}
                >
                  {v.status === 'done'
                    ? 'Completed'
                    : v.status === 'overdue'
                    ? 'Overdue'
                    : 'Upcoming'}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {p.chronic && (
        <Card className="p-4">
          <SectionHeader title="Chronic disease monitoring" />
          <div className="space-y-1.5 text-xs text-slate-600">
            <p>
              <span className="font-semibold text-slate-800">Condition:</span>{' '}
              {p.chronic.condition}
            </p>
            <p>
              <span className="font-semibold text-slate-800">
                Diagnosed since:
              </span>{' '}
              {p.chronic.since}
            </p>
            {p.chronic.lastHbA1c && (
              <p>
                <span className="font-semibold text-slate-800">
                  Last HbA1c:
                </span>{' '}
                {p.chronic.lastHbA1c}
              </p>
            )}
            <span
              className={`inline-block mt-1 px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                p.chronic.risk === 'High'
                  ? 'bg-rose-50 text-rose-600'
                  : 'bg-amber-50 text-amber-600'
              }`}
            >
              {p.chronic.risk} risk
            </span>
          </div>
        </Card>
      )}

      <Card className="p-4">
        <SectionHeader title="Visit history" />
        <div className="space-y-3">
          {p.history.map((h, i) => (
            <div key={i} className="flex gap-3">
              <div className="flex flex-col items-center pt-1">
                <div className="w-2 h-2 rounded-full bg-teal-500" />
                {i !== p.history.length - 1 && (
                  <div className="w-px flex-1 bg-slate-200 mt-1" />
                )}
              </div>
              <div className="pb-3">
                <p className="text-[11px] font-semibold text-slate-400">
                  {h.date}
                </p>
                <p className="text-xs text-slate-700 mt-0.5">{h.note}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">by {h.by}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ------------------------------- AI ASSISTANT ------------------------------- */

function aiReply(text) {
  const q = text.toLowerCase();
  if (q.includes('overdue') && q.includes('vaccin')) {
    return {
      title: 'Overdue vaccination guidance',
      points: [
        'Visit the household and explain why catch-up vaccination matters, in simple reassuring language.',
        "Check the child's vaccination card to confirm exactly which dose is due.",
        'Book the next available session at the sub-centre or anganwadi, ideally within the week.',
        "Record the new follow-up date in the patient's record and set a reminder.",
      ],
    };
  }
  if (q.match(/bp|blood pressure|170|180|160/)) {
    return {
      title: 'High blood pressure - suggested response',
      points: [
        'A reading like this is significantly above normal and needs prompt medical attention.',
        'Advise the patient to rest, avoid salt and exertion, and recheck BP after 30 minutes.',
        'If it remains high, refer the patient to the nearest PHC or call 108 if there are symptoms like chest pain, severe headache or breathlessness.',
        "Document the reading and refer-out in the patient's chronic care record.",
      ],
    };
  }
  if (q.includes('follow') || q.includes('schedule')) {
    return {
      title: 'Suggested follow-up schedule',
      points: [
        'For chronic conditions (BP/diabetes), a follow-up every 2 weeks until stable, then monthly.',
        'For ANC, follow the trimester schedule: monthly until 28 weeks, fortnightly until 36 weeks, weekly after.',
        'For PNC, visits on day 3, day 7 and day 14 are recommended.',
        'Set a reminder in Sangini AI so it appears on your daily visit list automatically.',
      ],
    };
  }
  if (q.includes('fever') || q.includes('temperature')) {
    return {
      title: 'Managing fever in a child',
      points: [
        'Check temperature and look for danger signs - fast breathing, lethargy, refusal to feed.',
        'Advise plenty of fluids and light clothing; paracetamol dosing as per weight if locally permitted.',
        'If fever persists beyond 2 days or danger signs appear, refer to PHC immediately.',
        'Schedule a follow-up visit the next day to recheck.',
      ],
    };
  }
  return {
    title: 'General guidance',
    points: [
      'Thanks for sharing this - here is some general, supportive guidance based on public healthcare best practices.',
      "Document your observation carefully with vitals and symptoms in the patient's record.",
      "If you're unsure or the case seems serious, please consult the PHC doctor or your supervisor.",
      "I'm a decision-support tool, not a replacement for a qualified medical professional.",
    ],
  };
}

const suggestedPrompts = [
  "A child's vaccination is overdue",
  "This patient's BP is 170/110",
  'What follow-up should I schedule?',
  'Child has fever since yesterday',
];

function AssistantScreen() {
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      title: 'Namaste, Sunita ji!',
      points: [
        "I'm Sangini, your AI health assistant. Ask me about symptoms, vitals, vaccination schedules or follow-up planning.",
        'I provide decision-support guidance only - always use your training and refer serious cases to a doctor.',
      ],
    },
  ]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, thinking]);

  const send = (text) => {
    const t = text ?? input;
    if (!t.trim()) return;
    setMessages((m) => [...m, { role: 'user', text: t }]);
    setInput('');
    setThinking(true);
    setTimeout(() => {
      setThinking(false);
      setMessages((m) => [...m, { role: 'ai', ...aiReply(t) }]);
    }, 1100);
  };

  return (
    <div className="px-5 -mt-3 pb-28 flex flex-col">
      <Card className="p-3 mb-3 bg-amber-50/70 border-amber-100 flex items-start gap-2">
        <ShieldCheck size={16} className="text-amber-600 mt-0.5 shrink-0" />
        <p className="text-[11px] text-amber-700 leading-relaxed">
          Sangini AI offers decision-support guidance based on public healthcare
          best practices. It does not replace a doctor — always refer serious or
          uncertain cases to your PHC.
        </p>
      </Card>

      <div className="space-y-3">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${
              m.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {m.role === 'user' ? (
              <div className="bg-teal-600 text-white text-sm px-4 py-2.5 rounded-2xl rounded-br-md max-w-[80%]">
                {m.text}
              </div>
            ) : (
              <div className="bg-white border border-slate-100 shadow-sm rounded-2xl rounded-bl-md max-w-[88%] px-4 py-3">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Sparkles size={13} className="text-teal-500" />
                  <span className="text-xs font-bold text-slate-800">
                    {m.title}
                  </span>
                </div>
                <ul className="space-y-1.5">
                  {m.points.map((pt, j) => (
                    <li
                      key={j}
                      className="text-xs text-slate-600 leading-relaxed flex gap-1.5"
                    >
                      <span className="text-teal-500 mt-0.5">•</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
        {thinking && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-2">
              <Loader2 size={14} className="animate-spin text-teal-500" />
              <span className="text-xs text-slate-400">
                Sangini is thinking...
              </span>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {messages.length <= 1 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {suggestedPrompts.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              className="text-[11px] bg-teal-50 text-teal-700 font-medium px-3 py-2 rounded-full border border-teal-100 active:scale-95 transition"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="fixed bottom-16 left-0 right-0 max-w-md mx-auto px-5 py-3 bg-gradient-to-t from-white via-white to-transparent">
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-2xl px-3 py-2 shadow-md shadow-slate-200/50">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
            placeholder="Ask Sangini anything..."
            className="flex-1 bg-transparent outline-none text-sm py-1"
          />
          <button
            onClick={() => send()}
            className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 active:scale-95 transition"
          >
            <Send size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------ VILLAGE DASHBOARD --------------------------- */

function VillageScreen() {
  return (
    <div className="px-5 -mt-3 pb-6 space-y-4">
      <Card className="p-4 bg-gradient-to-br from-teal-600 to-blue-600 text-white">
        <p className="text-xs text-teal-50/80">Village health overview</p>
        <p className="font-bold text-lg">{VILLAGE}</p>
        <div className="grid grid-cols-2 gap-3 mt-3">
          <div>
            <p className="text-2xl font-bold">{villageStats.totalHouseholds}</p>
            <p className="text-[11px] text-teal-50/80">Households</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{villageStats.totalPopulation}</p>
            <p className="text-[11px] text-teal-50/80">Population covered</p>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <SectionHeader title="Vaccination coverage" />
        <div className="flex items-center gap-4">
          <div className="relative w-20 h-20 shrink-0">
            <svg viewBox="0 0 36 36" className="w-20 h-20 -rotate-90">
              <circle
                cx="18"
                cy="18"
                r="15.5"
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="3.5"
              />
              <circle
                cx="18"
                cy="18"
                r="15.5"
                fill="none"
                stroke="#0d9488"
                strokeWidth="3.5"
                strokeDasharray={`${villageStats.vaccinationCoverage}, 100`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-slate-800">
              {villageStats.vaccinationCoverage}%
            </div>
          </div>
          <div className="flex-1 text-xs text-slate-500 leading-relaxed">
            {villageStats.vaccinationCoverage}% of children under 5 are fully
            vaccinated for age. 7 children currently due this month.
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <StatTile
          icon={Clock}
          label="Pending follow-ups"
          value={villageStats.pendingFollowUps}
          tint="bg-amber-50 text-amber-600"
        />
        <StatTile
          icon={AlertTriangle}
          label="High-risk patients"
          value={villageStats.highRiskPatients}
          tint="bg-rose-50 text-rose-600"
        />
        <StatTile
          icon={Baby}
          label="Pregnant women"
          value={villageStats.pregnantWomen}
          tint="bg-pink-50 text-pink-600"
        />
        <StatTile
          icon={Users}
          label="Children under 5"
          value={villageStats.childrenUnder5}
          tint="bg-blue-50 text-blue-600"
        />
      </div>

      <Card className="p-4">
        <SectionHeader title="Maternal & child health" />
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-500">Institutional deliveries</span>
              <span className="font-semibold text-slate-700">
                {villageStats.institutionalDeliveries}%
              </span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-teal-500 rounded-full"
                style={{ width: `${villageStats.institutionalDeliveries}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-500">ANC 4+ visits completed</span>
              <span className="font-semibold text-slate-700">78%</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{ width: '78%' }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-500">
                Full immunization (under 2)
              </span>
              <span className="font-semibold text-slate-700">87%</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full"
                style={{ width: '87%' }}
              />
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <SectionHeader title="Chronic disease monitoring" />
        <div className="flex items-center justify-between text-xs">
          <div className="text-center flex-1">
            <p className="text-lg font-bold text-slate-800">
              {villageStats.chronicPatients}
            </p>
            <p className="text-slate-400">Total cases</p>
          </div>
          <div className="text-center flex-1 border-x border-slate-100">
            <p className="text-lg font-bold text-rose-600">
              {villageStats.highRiskPatients}
            </p>
            <p className="text-slate-400">High risk</p>
          </div>
          <div className="text-center flex-1">
            <p className="text-lg font-bold text-teal-600">32</p>
            <p className="text-slate-400">Stable</p>
          </div>
        </div>
      </Card>
    </div>
  );
}

/* ----------------------------------- OCR ------------------------------------ */

function OcrScreen() {
  const [status, setStatus] = useState('idle'); // idle, scanning, done
  const [fileName, setFileName] = useState('');

  const simulateUpload = () => {
    setFileName('prescription_18jun2026.jpg');
    setStatus('scanning');
    setTimeout(() => setStatus('done'), 1800);
  };

  const reset = () => {
    setStatus('idle');
    setFileName('');
  };

  return (
    <div className="px-5 -mt-3 pb-6 space-y-4">
      <Card className="p-4">
        <SectionHeader title="Upload prescription or health document" />
        {status === 'idle' && (
          <button
            onClick={simulateUpload}
            className="w-full border-2 border-dashed border-teal-200 rounded-2xl py-10 flex flex-col items-center gap-2 active:scale-[0.99] transition bg-teal-50/30"
          >
            <div className="w-12 h-12 rounded-2xl bg-teal-100 flex items-center justify-center text-teal-600">
              <Camera size={22} />
            </div>
            <p className="text-sm font-semibold text-slate-700">
              Tap to scan or upload
            </p>
            <p className="text-xs text-slate-400">
              Prescription, lab report or health card
            </p>
          </button>
        )}
        {status === 'scanning' && (
          <div className="py-10 flex flex-col items-center gap-3">
            <Loader2 size={28} className="animate-spin text-teal-600" />
            <p className="text-sm font-medium text-slate-600">
              Reading {fileName}...
            </p>
            <p className="text-xs text-slate-400">Extracting text using OCR</p>
          </div>
        )}
        {status === 'done' && (
          <div className="flex items-center gap-3 bg-teal-50 rounded-2xl p-3">
            <FileText size={20} className="text-teal-600 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-700 truncate">
                {fileName}
              </p>
              <p className="text-xs text-teal-600">Extraction complete</p>
            </div>
            <button onClick={reset} className="text-slate-400">
              <X size={16} />
            </button>
          </div>
        )}
      </Card>

      {status === 'done' && (
        <Card className="p-4">
          <SectionHeader title="Extracted information" />
          <div className="space-y-2.5 text-xs">
            {[
              { l: 'Patient name', v: 'Kamla Bai' },
              { l: 'Date', v: '18 June 2026' },
              { l: 'Doctor', v: 'Dr. R. K. Sharma, PHC Najafgarh' },
              { l: 'Diagnosis', v: 'Type 2 Diabetes Mellitus, Hypertension' },
              {
                l: 'Medicines',
                v: 'Metformin 500mg - 2x daily, Amlodipine 5mg - 1x daily',
              },
              { l: 'Next visit advised', v: '2 weeks' },
            ].map((row) => (
              <div
                key={row.l}
                className="flex justify-between gap-3 border-b border-slate-50 pb-2"
              >
                <span className="text-slate-400 shrink-0 w-28">{row.l}</span>
                <span className="text-slate-700 font-medium text-right">
                  {row.v}
                </span>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 bg-teal-600 text-white text-sm font-semibold rounded-xl py-3 flex items-center justify-center gap-2 active:scale-[0.98] transition">
            <CheckCircle2 size={16} /> Save to patient record
          </button>
        </Card>
      )}
    </div>
  );
}

/* -------------------------------- NOTIFICATIONS ------------------------------ */

const notifIcon = {
  vaccine: Syringe,
  followup: Clock,
  anc: Baby,
  medicine: Activity,
  pnc: Heart,
};

function NotificationsPanel({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-slate-900/30" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white h-full overflow-y-auto rounded-l-[28px] shadow-xl animate-in slide-in-from-right">
        <div className="sticky top-0 bg-white px-5 pt-5 pb-3 border-b border-slate-50 flex items-center justify-between">
          <h2 className="font-bold text-slate-800">Notifications</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center"
          >
            <X size={16} />
          </button>
        </div>
        <div className="p-5 space-y-2.5">
          {notificationsData.map((n) => {
            const Icon = notifIcon[n.type] || Bell;
            return (
              <Card
                key={n.id}
                className={`p-3.5 flex items-start gap-3 ${
                  n.urgent ? 'border-rose-100' : ''
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    n.urgent
                      ? 'bg-rose-50 text-rose-600'
                      : 'bg-teal-50 text-teal-600'
                  }`}
                >
                  <Icon size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800">
                    {n.title}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">{n.sub}</p>
                  <p className="text-[10px] text-slate-400 mt-1">{n.time}</p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------- ROOT APP --------------------------------- */

export default function SanginiAI() {
  const { isLoggedIn } = useAuth();
  const [tab, setTab] = useState("home");
  const [showNotif, setShowNotif] = useState(false);

  if (!isLoggedIn) return <Login />;

  const titles = {
    home: null,
    visit: 'Record a home visit',
    patients: 'Patient records',
    assistant: 'AI Health Assistant',
    village: 'Village health dashboard',
    ocr: 'Scan document',
  };

  return (
    <div className="min-h-screen bg-slate-50 max-w-md mx-auto relative font-sans">
      <TopBar
        onNotif={() => setShowNotif(true)}
        onLogout={() => import("./services/authService").then(m => m.logoutUser())}
        unread={notificationsData.filter((n) => n.urgent).length}
      />

      {tab !== 'home' && (
        <div className="px-5 -mt-3 pb-2 flex items-center gap-2 pt-3">
          {tab !== 'ocr' ? null : (
            <button onClick={() => setTab('home')} className="text-slate-400">
              <ChevronLeft size={18} />
            </button>
          )}
        </div>
      )}
      {tab !== 'home' && titles[tab] && (
        <div className="px-5 -mt-1 pb-2">
          <h1 className="text-lg font-bold text-slate-800">{titles[tab]}</h1>
        </div>
      )}

      {tab === 'home' && (
        <HomeScreen go={setTab} openNotif={() => setShowNotif(true)} />
      )}
      {tab === 'visit' && <RecordVisitScreen />}
      {tab === 'patients' && <PatientsScreen />}
      {tab === 'assistant' && <AssistantScreen />}
      {tab === 'village' && <VillageScreen />}
      {tab === 'ocr' && <OcrScreen />}

      <BottomNav active={tab} setActive={setTab} />
      {showNotif && <NotificationsPanel onClose={() => setShowNotif(false)} />}
    </div>
  );
}
