// @ts-nocheck
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "./firebase";

export const getVillageStats = async (villageId = "rampur-khera") => {
  try {
    const patientsSnap = await getDocs(
      query(collection(db, "patients"), where("villageId", "==", villageId))
    );

    const patients = patientsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

    const total = patients.length;
    const highRisk = patients.filter((p) => p.riskLevel === "High").length;
    const mediumRisk = patients.filter((p) => p.riskLevel === "Medium").length;
    const pregnant = patients.filter((p) => p.type === "Pregnant").length;
    const chronic = patients.filter((p) => p.type === "Chronic").length;
    const children = patients.filter((p) => p.type === "Child").length;
    const postnatal = patients.filter((p) => p.type === "Postnatal").length;

    return {
      total,
      highRisk,
      mediumRisk,
      pregnant,
      chronic,
      children,
      postnatal,
      lowRisk: total - highRisk - mediumRisk,
      vaccinationCoverage: Math.round((children / Math.max(total, 1)) * 100),
    };
  } catch (error) {
    console.error("Analytics error:", error);
    throw error;
  }
};