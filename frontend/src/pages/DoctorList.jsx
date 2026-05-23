import React, { useEffect, useState } from 'react';
import api from '../api/client';

const DoctorList = () => {
    const [doctors, setDoctors] = useState([]);

    useEffect(() => {
        // Fetching the doctor data we just added
        api.get('/doctors/')
            .then(response => setDoctors(response.data))
            .catch(error => console.error("Error fetching doctors:", error));
    }, []);

    return (
        <div>
            <h2>Doctor Directory</h2>
            <ul>
                {doctors.map(doctor => (
                    <li key={doctor.id}>
                        {doctor.full_name} - {doctor.department}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default DoctorList;