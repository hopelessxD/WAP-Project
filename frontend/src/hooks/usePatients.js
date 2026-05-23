import { useState, useEffect } from 'react';
import api from '../api/client';

export const usePatients = () => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                // Ensure your Django URL matches this endpoint
                const response = await api.get('/patients/'); 
                setPatients(response.data);
            } catch (error) {
                console.error("Error fetching patients:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPatients();
    }, []);

    return { patients, loading };
};