// @ts-nocheck
import { collection, addDoc, getDocs, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

const samplePatients = [
  {
    name: "Kamla Bai",
    age: 62,
    gender: "Female",
    phone: "98xxx10231",
    village: "Ward 3",
    villageId: "rampur-khera",
    type: "Chronic",
    conditions: ["Type 2 Diabetes", "Hypertension"],
    vitals: {
      bp: "172/108",
      sugar: "240 mg/dL",
      temp: "98.4°F",
      weight: "58 kg",
    },
    riskLevel: "High",
    ashaWorkerId: "default",
  },
  {
    name: "Reema Devi",
    age: 24,
    gender: "Female",
    phone: "98xxx55214",
    village: "Ward 1",
    villageId: "rampur-khera",
    type: "Pregnant",
    conditions: ["ANC - 3rd Trimester"],
    vitals: {
      bp: "118/76",
      sugar: "—",
      temp: "98.6°F",
      weight: "61 kg",
    },
    riskLevel: "Medium",
    pregnancy: {
      lmp: "2026-01-02",
      edd: "2026-10-09",
      trimester: 3,
      ancVisits: 4,
    },
    ashaWorkerId: "default",
  },
  {
    name: "Aarav Sharma",
    age: 1,
    gender: "Male",
    phone: "98xxx88012",
    village: "Ward 2",
    villageId: "rampur-khera",
    type: "Child",
    conditions: ["Vaccination tracking"],
    vitals: {
      bp: "—",
      sugar: "—",
      temp: "98.2°F",
      weight: "9.1 kg",
    },
    riskLevel: "Low",
    ashaWorkerId: "default",
  },
  {
    name: "Mohan Lal",
    age: 70,
    gender: "Male",
    phone: "98xxx33890",
    village: "Ward 4",
    villageId: "rampur-khera",
    type: "Chronic",
    conditions: ["Hypertension"],
    vitals: {
      bp: "164/100",
      sugar: "118 mg/dL",
      temp: "98.0°F",
      weight: "67 kg",
    },
    riskLevel: "High",
    ashaWorkerId: "default",
  },
  {
    name: "Sita Kumari",
    age: 29,
    gender: "Female",
    phone: "98xxx77341",
    village: "Ward 1",
    villageId: "rampur-khera",
    type: "Postnatal",
    conditions: ["PNC - 10 day check"],
    vitals: {
      bp: "112/74",
      sugar: "—",
      temp: "98.8°F",
      weight: "54 kg",
    },
    riskLevel: "Medium",
    ashaWorkerId: "default",
  },
];

export const seedPatients = async () => {
  try {
    const existing = await getDocs(collection(db, "patients"));
    if (!existing.empty) {
      console.log("Patients already seeded — skipping.");
      return;
    }
    for (const patient of samplePatients) {
      await addDoc(collection(db, "patients"), {
        ...patient,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
    console.log("Sample patients added to Firestore successfully.");
  } catch (error) {
    console.error("Seeding failed:", error);
  }
};