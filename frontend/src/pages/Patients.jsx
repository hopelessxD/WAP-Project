import React from 'react';
import PatientTable from '../components/PatientTable';
import AddPatientForm from '../components/AddPatientForm';
import { usePatients } from '../hooks/usePatients';

const Patients = () => {
    // 1. Get data from hook
    const { patients, loading, refreshPatients, deletePatient } = usePatients();

    return (
        <div style={{ padding: '20px' }}>
            <h1>Hospital Management System</h1>
            
            <section>
                <h2>Add New Patient</h2>
                <AddPatientForm onPatientAdded={refreshPatients} />
            </section>

            <hr />

            <section>
                <h2>Patient Records</h2>
                {/* 2. Pass data AND the delete function down as props */}
                <PatientTable 
                    patients={patients} 
                    loading={loading} 
                    deletePatient={deletePatient} 
                />
            </section>
        </div>
    );
};

export default Patients;