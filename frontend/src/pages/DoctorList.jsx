import React, { useEffect, useState } from 'react';
import api from '../api/client';
 
// ─── Shared UI helpers ────────────────────────────────────────────────────────
 
function Badge({ children, color = 'blue' }) {
  const colors = {
    blue:  { bg: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe' },
    green: { bg: '#f0fdf4', text: '#15803d', border: '#bbf7d0' },
    gray:  { bg: '#f8fafc', text: '#475569', border: '#e2e8f0' },
    red:   { bg: '#fef2f2', text: '#b91c1c', border: '#fecaca' },
  };
  const c = colors[color] || colors.blue;
  return (
    <span style={{
      background: c.bg, color: c.text, border: `1px solid ${c.border}`,
      borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 600,
    }}>{children}</span>
  );
}
 
function Input({ label, ...props }) {
  return (
    <div>
      <label style={{
        fontSize: 11, fontWeight: 600, color: '#64748b',
        textTransform: 'uppercase', letterSpacing: '0.05em',
        display: 'block', marginBottom: 4,
      }}>{label}</label>
      <input {...props} style={{
        width: '100%', padding: '8px 10px',
        border: '1px solid #e2e8f0', borderRadius: 6,
        fontSize: 13, background: '#f8fafc', color: '#0f172a',
        boxSizing: 'border-box', outline: 'none',
        ...props.style,
      }} />
    </div>
  );
}
 
// ─── Avatar initials ──────────────────────────────────────────────────────────
 
// Cycles through a palette based on the doctor's id
const AVATAR_COLORS = [
  { bg: '#eff6ff', text: '#1d4ed8' },
  { bg: '#f0fdf4', text: '#15803d' },
  { bg: '#fdf4ff', text: '#7e22ce' },
  { bg: '#fff7ed', text: '#c2410c' },
  { bg: '#f0fdfa', text: '#0f766e' },
];
 
function Avatar({ name, id }) {
  const initials = name
    ? name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'DR';
  const palette = AVATAR_COLORS[(id || 0) % AVATAR_COLORS.length];
  return (
    <div style={{
      width: 48, height: 48, borderRadius: '50%',
      background: palette.bg, color: palette.text,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 14, fontWeight: 700, flexShrink: 0,
      border: '2px solid white',
      boxShadow: '0 0 0 1px #e2e8f0',
    }}>{initials}</div>
  );
}
 
// ─── Add Doctor Form ──────────────────────────────────────────────────────────
 
function AddDoctorForm({ departments, onDoctorAdded }) {
  const [form, setForm] = useState({ full_name: '', department: '', contact_number: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
 
  const handleSubmit = async () => {
    if (!form.full_name.trim()) { setError('Full name is required.'); return; }
    if (!form.department)       { setError('Please select a department.'); return; }
    setSaving(true);
    setError('');
    try {
      await api.post('/doctors/', {
        full_name: form.full_name.trim(),
        department: parseInt(form.department),   // FK id
        contact_number: form.contact_number.trim(),
      });
      setForm({ full_name: '', department: '', contact_number: '' });
      onDoctorAdded();
    } catch (err) {
      console.error('Error adding doctor:', err);
      setError(err.response?.data ? JSON.stringify(err.response.data) : 'Failed to add doctor.');
    } finally {
      setSaving(false);
    }
  };
 
  return (
    <div style={{
      background: '#fff', border: '1px solid #e2e8f0',
      borderRadius: 12, padding: 24, marginBottom: 28,
    }}>
      <h2 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 600, color: '#1e293b' }}>
        Add New Doctor
      </h2>
 
      {error && (
        <div style={{
          background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 6,
          padding: '8px 12px', marginBottom: 12, color: '#b91c1c', fontSize: 13,
        }}>{error}</div>
      )}
 
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
        <Input
          label="Full Name"
          placeholder="e.g. Anita Rai"
          value={form.full_name}
          onChange={e => setForm({ ...form, full_name: e.target.value })}
        />
 
        {/* Department — FK dropdown populated from API */}
        <div>
          <label style={{
            fontSize: 11, fontWeight: 600, color: '#64748b',
            textTransform: 'uppercase', letterSpacing: '0.05em',
            display: 'block', marginBottom: 4,
          }}>Department</label>
          <select
            value={form.department}
            onChange={e => setForm({ ...form, department: e.target.value })}
            style={{
              width: '100%', padding: '8px 10px',
              border: '1px solid #e2e8f0', borderRadius: 6,
              fontSize: 13, background: '#f8fafc', color: '#0f172a',
              boxSizing: 'border-box',
            }}
          >
            <option value="">Select department…</option>
            {departments.map(dept => (
              <option key={dept.id} value={dept.id}>{dept.name}</option>
            ))}
          </select>
        </div>
 
        <Input
          label="Contact Number"
          placeholder="e.g. 9841000001"
          value={form.contact_number}
          onChange={e => setForm({ ...form, contact_number: e.target.value })}
        />
      </div>
 
      <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
        <button
          onClick={handleSubmit}
          disabled={saving}
          style={{
            background: saving ? '#93c5fd' : '#1d4ed8', color: '#fff',
            border: 'none', borderRadius: 7, padding: '9px 20px',
            fontSize: 13, fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer',
          }}
        >
          {saving ? 'Saving…' : 'Add Doctor'}
        </button>
      </div>
    </div>
  );
}
 
// ─── Doctor Card ──────────────────────────────────────────────────────────────
 
function DoctorCard({ doctor, onDelete }) {
  const [deleting, setDeleting] = useState(false);
 
  const handleDelete = async () => {
    if (!window.confirm(`Remove Dr. ${doctor.full_name}?`)) return;
    setDeleting(true);
    try {
      await api.delete(`/doctors/${doctor.id}/`);
      onDelete(doctor.id);
    } catch (err) {
      console.error('Delete failed:', err);
      setDeleting(false);
    }
  };
 
  // department may be an object {id, name} or a plain string depending on serializer
  const deptName = typeof doctor.department === 'object'
    ? doctor.department?.name
    : doctor.department;
 
  return (
    <div style={{
      background: '#fff', border: '1px solid #e2e8f0',
      borderRadius: 14, padding: '20px',
      display: 'flex', flexDirection: 'column', gap: 0,
      transition: 'box-shadow 0.15s ease',
    }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
    >
      {/* Top section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
        <Avatar name={doctor.full_name} id={doctor.id} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, color: '#0f172a', fontSize: 14, marginBottom: 2 }}>
            Dr. {doctor.full_name}
          </div>
          <Badge color="blue">{deptName || '—'}</Badge>
        </div>
      </div>
 
      {/* Divider */}
      <div style={{ borderTop: '1px solid #f1f5f9', margin: '0 -20px', marginBottom: 14 }} />
 
      {/* Contact row */}
      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#475569', fontSize: 13 }}>
          <span style={{ fontSize: 14 }}>📞</span>
          <span>{doctor.contact_number || '—'}</span>
        </div>
 
        <button
          onClick={handleDelete}
          disabled={deleting}
          style={{
            background: '#fef2f2', color: '#b91c1c',
            border: '1px solid #fecaca', borderRadius: 6,
            padding: '4px 10px', fontSize: 11, fontWeight: 600,
            cursor: deleting ? 'not-allowed' : 'pointer', opacity: deleting ? 0.6 : 1,
          }}
        >
          {deleting ? '…' : 'Remove'}
        </button>
      </div>
    </div>
  );
}
 
// ─── Page ─────────────────────────────────────────────────────────────────────
 
const DoctorList = () => {
  const [doctors, setDoctors]         = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState('');
  const [showForm, setShowForm]       = useState(false);
 
  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const res = await api.get('/doctors/');
      setDoctors(res.data);
      setError('');
    } catch (err) {
      console.error('Error fetching doctors:', err);
      setError('Failed to load doctors.');
    } finally {
      setLoading(false);
    }
  };
 
  // Fetch departments once for the add-form dropdown
  useEffect(() => {
    api.get('/departments/')
      .then(res => setDepartments(res.data))
      .catch(err => console.error('Could not load departments:', err));
 
    fetchDoctors();
  }, []);
 
  const handleDeleted = (id) => setDoctors(prev => prev.filter(d => d.id !== id));
 
  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#0f172a' }}>Doctor Directory</h1>
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 13 }}>
            {loading ? 'Loading…' : `${doctors.length} doctor${doctors.length !== 1 ? 's' : ''} on staff`}
          </p>
        </div>
        <button
          onClick={() => setShowForm(v => !v)}
          style={{
            background: '#1d4ed8', color: '#fff', border: 'none',
            borderRadius: 8, padding: '9px 16px', fontSize: 13, fontWeight: 600,
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
          }}
        >
          {showForm ? '✕ Close' : '+ Add Doctor'}
        </button>
      </div>
 
      {/* Add form (collapsible) */}
      {showForm && (
        <AddDoctorForm
          departments={departments}
          onDoctorAdded={() => { fetchDoctors(); setShowForm(false); }}
        />
      )}
 
      {/* Error banner */}
      {error && (
        <div style={{
          background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8,
          padding: '12px 16px', marginBottom: 20, color: '#b91c1c', fontSize: 13,
        }}>{error}</div>
      )}
 
      {/* Loading skeletons */}
      {loading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} style={{
              height: 120, borderRadius: 14, border: '1px solid #e2e8f0',
              background: 'linear-gradient(90deg, #f1f5f9 25%, #e8edf2 50%, #f1f5f9 75%)',
              backgroundSize: '300% 100%',
            }} />
          ))}
        </div>
      )}
 
      {/* Cards grid */}
      {!loading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
          {doctors.map(doc => (
            <DoctorCard key={doc.id} doctor={doc} onDelete={handleDeleted} />
          ))}
 
          {doctors.length === 0 && (
            <div style={{
              gridColumn: '1 / -1', textAlign: 'center', padding: '60px 20px',
              color: '#94a3b8', fontSize: 13,
              background: '#fff', border: '1px dashed #e2e8f0', borderRadius: 14,
            }}>
              No doctors yet — click <strong>+ Add Doctor</strong> to get started.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
 
export default DoctorList;