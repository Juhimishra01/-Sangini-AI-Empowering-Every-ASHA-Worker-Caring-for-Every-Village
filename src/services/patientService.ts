// @ts-nocheck
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

const PATIENTS = "patients";
const VISITS = "visits";
const FOLLOWUPS = "followUps";

// CREATE — add a new patient
export const addPatient = async (patientData) => {
  const docRef = await addDoc(collection(db, PATIENTS), {
    ...patientData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
};

// READ — get all patients for a village
export const getPatients = async (villageId) => {
  const q = query(
    collection(db, PATIENTS),
    where("villageId", "==", villageId),
    orderBy("name", "asc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// READ — get single patient
export const getPatient = async (patientId) => {
  const docRef = doc(db, PATIENTS, patientId);
  const snapshot = await getDoc(docRef);
  if (snapshot.exists()) {
    return { id: snapshot.id, ...snapshot.data() };
  }
  return null;
};

// UPDATE — update patient details
export const updatePatient = async (patientId, updatedData) => {
  const docRef = doc(db, PATIENTS, patientId);
  await updateDoc(docRef, {
    ...updatedData,
    updatedAt: serverTimestamp(),
  });
};

// DELETE — remove a patient
export const deletePatient = async (patientId) => {
  await deleteDoc(doc(db, PATIENTS, patientId));
};

// CREATE — record a home visit
export const addVisit = async (visitData) => {
  const docRef = await addDoc(collection(db, VISITS), {
    ...visitData,
    visitedAt: serverTimestamp(),
  });
  return docRef.id;
};

// READ — get all visits for a patient
export const getPatientVisits = async (patientId) => {
  const q = query(
    collection(db, VISITS),
    where("patientId", "==", patientId),
    orderBy("visitedAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// CREATE — add follow up reminder
export const addFollowUp = async (followUpData) => {
  const docRef = await addDoc(collection(db, FOLLOWUPS), {
    ...followUpData,
    createdAt: serverTimestamp(),
    completed: false,
  });
  return docRef.id;
};

// READ — get pending follow ups
export const getPendingFollowUps = async (ashaWorkerId) => {
  const q = query(
    collection(db, FOLLOWUPS),
    where("ashaWorkerId", "==", ashaWorkerId),
    where("completed", "==", false)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};