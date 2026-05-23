import React, { useState } from 'react';
import PatientTable from '../components/PatientTable';
import AddPatientForm from '../components/AddPatientForm';
import { usePatients } from '../hooks/usePatients';
 
const Patients = () => {
  const { patients, loading, refreshPatients, deletePatient } = usePatients();
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch]     = useState('');
 
  const filtered = patients.filter(p =>
    p.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    p.blood_group?.toLowerCase().includes(search.toLowerCase()) ||
    p.diagnosis?.toLowerCase().includes(search.toLowerCase()) ||
    p.status?.toLowerCase().includes(search.toLowerCase())
  );
 
  return (
    <div>
      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#0f172a' }}>Patient Records</h1>
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 13 }}>
            {loading ? 'Loading…' : `${patients.length} patient${patients.length !== 1 ? 's' : ''} registered`}
          </p>
        </div>
        <button
          onClick={() => setShowForm(v => !v)}
          style={{
            background: '#1d4ed8', color: '#fff', border: 'none',
            borderRadius: 8, padding: '9px 16px', fontSize: 13, fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          {showForm ? '✕ Close' : '+ Add Patient'}
        </button>
      </div>
 
      {/* ── Add form ── */}
      {showForm && (
        <AddPatientForm
          onPatientAdded={() => { refreshPatients(); setShowForm(false); }}
        />
      )}
 
      {/* ── Search bar ── */}
      <div style={{ position: 'relative', marginBottom: 20 }}>
        <span style={{
          position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
          fontSize: 14, color: '#94a3b8', pointerEvents: 'none',
        }}>🔍</span>
        <input
          type="text"
          placeholder="Search by name, blood group, diagnosis, status…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%', padding: '9px 12px 9px 34px',
            border: '1px solid #e2e8f0', borderRadius: 8,
            fontSize: 13, background: '#fff', color: '#0f172a',
            boxSizing: 'border-box', outline: 'none',
          }}
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            style={{
              position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#94a3b8', fontSize: 16, lineHeight: 1,
            }}
          >✕</button>
        )}
      </div>
 
      {/* ── Results note when filtering ── */}
      {search && !loading && (
        <p style={{ fontSize: 12, color: '#64748b', marginBottom: 12, marginTop: -8 }}>
          {filtered.length} result{filtered.length !== 1 ? 's' : ''} for "{search}"
        </p>
      )}
 
      {/* ── Patient cards ── */}
      <PatientTable
        patients={filtered}
        loading={loading}
        deletePatient={deletePatient}
      />
    </div>
  );
};
 
export default Patients;