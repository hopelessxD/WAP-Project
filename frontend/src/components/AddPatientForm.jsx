import React, { useState } from 'react';
import api from '../api/client';
 
const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
const STATUSES     = ['Admitted', 'Discharged', 'Critical', 'Under Observation'];
 
const EMPTY = {
  full_name: '', age: '', contact_number: '',
  height_cm: '', weight_kg: '', blood_group: 'A+',
  diagnosis: '', status: 'Admitted',
};
 
function Field({ label, required, children }) {
  return (
    <div>
      <label style={{
        display: 'block', fontSize: 11, fontWeight: 600,
        color: '#64748b', textTransform: 'uppercase',
        letterSpacing: '0.05em', marginBottom: 4,
      }}>
        {label}{required && <span style={{ color: '#ef4444', marginLeft: 2 }}>*</span>}
      </label>
      {children}
    </div>
  );
}
 
const inputStyle = {
  width: '100%', padding: '8px 10px',
  border: '1px solid #e2e8f0', borderRadius: 6,
  fontSize: 13, background: '#f8fafc', color: '#0f172a',
  boxSizing: 'border-box', outline: 'none',
};
 
const AddPatientForm = ({ onPatientAdded }) => {
  const [formData, setFormData] = useState(EMPTY);
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState('');
 
  const set = (key, val) => setFormData(prev => ({ ...prev, [key]: val }));
 
  const handleSubmit = async () => {
    if (!formData.full_name.trim()) { setError('Full name is required.'); return; }
    if (!formData.age)              { setError('Age is required.'); return; }
    setSaving(true);
    setError('');
    try {
      await api.post('/patients/', formData);
      setFormData(EMPTY);
      onPatientAdded();
    } catch (err) {
      console.error('Error adding patient:', err);
      setError(err.response?.data ? JSON.stringify(err.response.data) : 'Failed to add patient.');
    } finally {
      setSaving(false);
    }
  };
 
  return (
    <div style={{
      background: '#fff', border: '1px solid #e2e8f0',
      borderRadius: 12, padding: 24, marginBottom: 24,
    }}>
      <h2 style={{ margin: '0 0 18px', fontSize: 15, fontWeight: 600, color: '#1e293b' }}>
        New Patient
      </h2>
 
      {error && (
        <div style={{
          background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 6,
          padding: '8px 12px', marginBottom: 14, color: '#b91c1c', fontSize: 13,
        }}>{error}</div>
      )}
 
      {/* Row 1: name, age, contact */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 12, marginBottom: 12 }}>
        <Field label="Full Name" required>
          <input
            style={inputStyle} placeholder="e.g. Anita Sharma"
            value={formData.full_name}
            onChange={e => set('full_name', e.target.value)}
          />
        </Field>
        <Field label="Age" required>
          <input
            style={inputStyle} type="number" placeholder="e.g. 34" min="0"
            value={formData.age}
            onChange={e => set('age', e.target.value)}
          />
        </Field>
        <Field label="Contact">
          <input
            style={inputStyle} placeholder="98XXXXXXXX"
            value={formData.contact_number}
            onChange={e => set('contact_number', e.target.value)}
          />
        </Field>
      </div>
 
      {/* Row 2: height, weight, blood group, status */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12, marginBottom: 12 }}>
        <Field label="Height (cm)">
          <input
            style={inputStyle} type="number" placeholder="e.g. 165"
            value={formData.height_cm}
            onChange={e => set('height_cm', e.target.value)}
          />
        </Field>
        <Field label="Weight (kg)">
          <input
            style={inputStyle} type="number" placeholder="e.g. 60"
            value={formData.weight_kg}
            onChange={e => set('weight_kg', e.target.value)}
          />
        </Field>
        <Field label="Blood Group">
          <select
            style={inputStyle}
            value={formData.blood_group}
            onChange={e => set('blood_group', e.target.value)}
          >
            {BLOOD_GROUPS.map(bg => <option key={bg} value={bg}>{bg}</option>)}
          </select>
        </Field>
        <Field label="Status">
          <select
            style={inputStyle}
            value={formData.status}
            onChange={e => set('status', e.target.value)}
          >
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </Field>
      </div>
 
      {/* Row 3: diagnosis */}
      <div style={{ marginBottom: 18 }}>
        <Field label="Diagnosis">
          <textarea
            style={{ ...inputStyle, resize: 'vertical', minHeight: 72 }}
            placeholder="Initial diagnosis or notes…"
            value={formData.diagnosis}
            onChange={e => set('diagnosis', e.target.value)}
          />
        </Field>
      </div>
 
      <button
        onClick={handleSubmit}
        disabled={saving}
        style={{
          background: saving ? '#93c5fd' : '#1d4ed8', color: '#fff',
          border: 'none', borderRadius: 7, padding: '9px 22px',
          fontSize: 13, fontWeight: 600,
          cursor: saving ? 'not-allowed' : 'pointer',
        }}
      >
        {saving ? 'Saving…' : 'Add Patient'}
      </button>
    </div>
  );
};
 
export default AddPatientForm;