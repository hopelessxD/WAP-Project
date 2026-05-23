import React, { useState } from 'react';
import api from '../api/axiosConfig';

const AddPatientForm = ({ onPatientAdded }) => {
    const [formData, setFormData] = useState({
        full_name: '', age: '', contact_number: '', 
        height_cm: '', weight_kg: '', blood_group: 'A+', 
        diagnosis: '', status: 'Admitted'
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/patients/', formData);
            alert('Patient added successfully!');
            onPatientAdded(); // Refresh list after adding
            setFormData({ full_name: '', age: '', contact_number: '', height_cm: '', weight_kg: '', blood_group: 'A+', diagnosis: '', status: 'Admitted' });
        } catch (error) {
            console.error("Error adding patient:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px' }}>
            <input type="text" placeholder="Full Name" onChange={(e) => setFormData({...formData, full_name: e.target.value})} required />
            <input type="number" placeholder="Age" onChange={(e) => setFormData({...formData, age: e.target.value})} required />
            <input type="text" placeholder="Contact Number" onChange={(e) => setFormData({...formData, contact_number: e.target.value})} />
            <input type="number" placeholder="Height (cm)" onChange={(e) => setFormData({...formData, height_cm: e.target.value})} />
            <input type="number" placeholder="Weight (kg)" onChange={(e) => setFormData({...formData, weight_kg: e.target.value})} />
            <select onChange={(e) => setFormData({...formData, blood_group: e.target.value})}>
                {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
            </select>
            <textarea placeholder="Diagnosis" onChange={(e) => setFormData({...formData, diagnosis: e.target.value})} />
            <button type="submit">Add Patient</button>
        </form>
    );
};

export default AddPatientForm;