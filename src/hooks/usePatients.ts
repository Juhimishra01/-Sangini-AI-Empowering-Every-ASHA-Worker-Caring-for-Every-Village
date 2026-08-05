// @ts-nocheck
import { useState, useEffect } from "react";
import { getPatients } from "../services/patientService";

export const usePatients = (villageId = "rampur-khera") => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        const data = await getPatients(villageId);
        setPatients(data);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching patients:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [villageId]);

  return { patients, loading, error };
};