import React from 'react';
import { usePatients } from '../hooks/usePatients';

const PatientTable = () => {
    const { patients, loading } = usePatients();

    if (loading) return <p>Loading records...</p>;

    return (
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Age</th>
                    <th>Blood Group</th>
                    <th>BMI</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                {patients.map((p) => (
                    <tr key={p.patient_id}>
                        <td>{p.patient_id}</td>
                        <td>{p.full_name}</td>
                        <td>{p.age}</td>
                        <td>{p.blood_group}</td>
                        <td>{p.bmi}</td>
                        <td>{p.status}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default PatientTable;