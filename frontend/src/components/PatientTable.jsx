import React from 'react';
import { usePatients } from '../hooks/usePatients';

const PatientTable = () => {
    // Make sure to pull deletePatient out of the hook here
    const { patients, loading, deletePatient } = usePatients();

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
                    <th>Actions</th>
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
                        <td>
                            <button 
                                onClick={() => deletePatient(p.patient_id)}
                                style={{ color: 'red' }}
                            >
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default PatientTable;