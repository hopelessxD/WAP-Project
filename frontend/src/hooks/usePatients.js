import { useState, useEffect, useCallback } from 'react';
import api from '../api/client';

export const usePatients = () => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);

    // useCallback ensures this function doesn't get recreated unnecessarily
    const fetchPatients = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get('/patients/');
            setPatients(response.data);
        } catch (error) {
            console.error("Error fetching patients:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    const deletePatient = async (id) => {
        try {
            await api.delete(`/patients/${id}/`);
            // Refresh the list after successful deletion
            await fetchPatients(); 
        } catch (error) {
            console.error("Delete failed", error);
        }
    };

    useEffect(() => {
        fetchPatients();
    }, [fetchPatients]);

    return { patients, loading, deletePatient, refreshPatients: fetchPatients };
};