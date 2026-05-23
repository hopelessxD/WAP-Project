import React, { useEffect, useState } from 'react';
import api from '../api/client';
 
// ─── Helpers ──────────────────────────────────────────────────────────────────
 
function Badge({ children, color = 'blue' }) {
  const colors = {
    blue:   { bg: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe' },
    green:  { bg: '#f0fdf4', text: '#15803d', border: '#bbf7d0' },
    amber:  { bg: '#fffbeb', text: '#b45309', border: '#fde68a' },
    gray:   { bg: '#f8fafc', text: '#475569', border: '#e2e8f0' },
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
 
// "2026-05-24" → "Sat, May 24 2026"
function formatDate(dateStr) {
  if (!dateStr) return '—';
  try {
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
    });
  } catch { return dateStr; }
}
 
// "14:30:00" → "2:30 PM"
function formatTime(timeStr) {
  if (!timeStr) return '—';
  try {
    const [h, m] = timeStr.split(':');
    const d = new Date();
    d.setHours(parseInt(h), parseInt(m));
    return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  } catch { return timeStr; }
}
 
function isUpcoming(dateStr) {
  if (!dateStr) return false;
  return new Date(dateStr + 'T00:00:00') >= new Date(new Date().toDateString());
}
 
// ─── Add Appointment Form ─────────────────────────────────────────────────────
 
function AddAppointmentForm({ doctors, patients, onAdded }) {
  const [form, setForm] = useState({ doctor: '', patient: '', day: '', start_time: '' });
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState('');
 
  const handleSubmit = async () => {
    if (!form.doctor)     { setError('Please select a doctor.'); return; }
    if (!form.day)        { setError('Please pick a date.'); return; }
    if (!form.start_time) { setError('Please pick a time.'); return; }
    setSaving(true);
    setError('');
    try {
      await api.post('/appointments/', {
        doctor:     parseInt(form.doctor),
        patient:    form.patient ? parseInt(form.patient) : null,  // nullable FK
        day:        form.day,
        start_time: form.start_time,
      });
      setForm({ doctor: '', patient: '', day: '', start_time: '' });
      onAdded();
    } catch (err) {
      console.error('Error adding appointment:', err);
      setError(err.response?.data ? JSON.stringify(err.response.data) : 'Failed to save appointment.');
    } finally {
      setSaving(false);
    }
  };
 
  const selectStyle = {
    width: '100%', padding: '8px 10px',
    border: '1px solid #e2e8f0', borderRadius: 6,
    fontSize: 13, background: '#f8fafc', color: '#0f172a',
    boxSizing: 'border-box',
  };
 
  return (
    <div style={{
      background: '#fff', border: '1px solid #e2e8f0',
      borderRadius: 12, padding: 24, marginBottom: 28,
    }}>
      <h2 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 600, color: '#1e293b' }}>
        Book Appointment
      </h2>
 
      {error && (
        <div style={{
          background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 6,
          padding: '8px 12px', marginBottom: 12, color: '#b91c1c', fontSize: 13,
        }}>{error}</div>
      )}
 
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12 }}>
        {/* Doctor FK */}
        <div>
          <label style={{
            fontSize: 11, fontWeight: 600, color: '#64748b',
            textTransform: 'uppercase', letterSpacing: '0.05em',
            display: 'block', marginBottom: 4,
          }}>Doctor</label>
          <select value={form.doctor} onChange={e => setForm({ ...form, doctor: e.target.value })} style={selectStyle}>
            <option value="">Select doctor…</option>
            {doctors.map(d => (
              <option key={d.id} value={d.id}>Dr. {d.full_name}</option>
            ))}
          </select>
        </div>
 
        {/* Patient FK (nullable) */}
        <div>
          <label style={{
            fontSize: 11, fontWeight: 600, color: '#64748b',
            textTransform: 'uppercase', letterSpacing: '0.05em',
            display: 'block', marginBottom: 4,
          }}>Patient <span style={{ color: '#94a3b8', fontWeight: 400 }}>(optional)</span></label>
          <select value={form.patient} onChange={e => setForm({ ...form, patient: e.target.value })} style={selectStyle}>
            <option value="">Walk-in / unassigned</option>
            {patients.map(p => (
              <option key={p.id} value={p.id}>{p.full_name || p.name}</option>
            ))}
          </select>
        </div>
 
        {/* Date */}
        <Input
          label="Date"
          type="date"
          value={form.day}
          onChange={e => setForm({ ...form, day: e.target.value })}
        />
 
        {/* Time */}
        <Input
          label="Start Time"
          type="time"
          value={form.start_time}
          onChange={e => setForm({ ...form, start_time: e.target.value })}
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
          {saving ? 'Saving…' : 'Book Appointment'}
        </button>
      </div>
    </div>
  );
}
 
// ─── Appointment Card ─────────────────────────────────────────────────────────
 
function AppointmentCard({ appt, onDelete }) {
  const [deleting, setDeleting] = useState(false);
  const upcoming = isUpcoming(appt.day);
 
  const handleDelete = async () => {
    if (!window.confirm('Cancel this appointment?')) return;
    setDeleting(true);
    try {
      await api.delete(`/appointments/${appt.id}/`);
      onDelete(appt.id);
    } catch (err) {
      console.error('Delete failed:', err);
      setDeleting(false);
    }
  };
 
  return (
    <div style={{
      background: '#fff', border: '1px solid #e2e8f0',
      borderRadius: 14, padding: 20, display: 'flex', flexDirection: 'column', gap: 12,
      transition: 'box-shadow 0.15s ease',
      borderLeft: `3px solid ${upcoming ? '#3b82f6' : '#cbd5e1'}`,
    }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
    >
      {/* Date + status row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 16 }}>📅</span>
          <div>
            <div style={{ fontWeight: 600, color: '#1e293b', fontSize: 13 }}>
              {formatDate(appt.day)}
            </div>
            <div style={{ color: '#64748b', fontSize: 12 }}>
              {formatTime(appt.start_time)}
            </div>
          </div>
        </div>
        <Badge color={upcoming ? 'blue' : 'gray'}>
          {upcoming ? 'Upcoming' : 'Completed'}
        </Badge>
      </div>
 
      {/* Divider */}
      <div style={{ borderTop: '1px solid #f1f5f9', margin: '0 -20px' }} />
 
      {/* Doctor */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          width: 32, height: 32, borderRadius: '50%', background: '#eff6ff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 10, fontWeight: 700, color: '#1d4ed8', flexShrink: 0,
          border: '1px solid #bfdbfe',
        }}>
          🩺
        </div>
        <div>
          <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500 }}>DOCTOR</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>
            {appt.doctor_name || '—'}
          </div>
        </div>
      </div>
 
      {/* Patient */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          width: 32, height: 32, borderRadius: '50%', background: '#f0fdf4',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 10, fontWeight: 700, color: '#15803d', flexShrink: 0,
          border: '1px solid #bbf7d0',
        }}>
          👤
        </div>
        <div>
          <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500 }}>PATIENT</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>
            {appt.patient_name || <span style={{ color: '#94a3b8', fontWeight: 400 }}>Walk-in</span>}
          </div>
        </div>
      </div>
 
      {/* Cancel button */}
      {upcoming && (
        <button
          onClick={handleDelete}
          disabled={deleting}
          style={{
            alignSelf: 'flex-start',
            background: '#fef2f2', color: '#b91c1c',
            border: '1px solid #fecaca', borderRadius: 6,
            padding: '5px 12px', fontSize: 11, fontWeight: 600,
            cursor: deleting ? 'not-allowed' : 'pointer', opacity: deleting ? 0.6 : 1,
          }}
        >
          {deleting ? 'Cancelling…' : 'Cancel Appointment'}
        </button>
      )}
    </div>
  );
}
 
// ─── Page ─────────────────────────────────────────────────────────────────────
 
const Schedule = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors,      setDoctors]      = useState([]);
  const [patients,     setPatients]     = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState('');
  const [showForm,     setShowForm]     = useState(false);
  const [filter,       setFilter]       = useState('all'); // 'all' | 'upcoming' | 'completed'
 
  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await api.get('/appointments/');
      // Sort newest-date first
      const sorted = [...res.data].sort((a, b) => new Date(a.day) - new Date(b.day));
      setAppointments(sorted);
      setError('');
    } catch (err) {
      console.error('Error fetching schedule:', err);
      setError('Failed to load appointments.');
    } finally {
      setLoading(false);
    }
  };
 
  useEffect(() => {
    fetchAppointments();
    api.get('/doctors/').then(r  => setDoctors(r.data)).catch(console.error);
    api.get('/patients/').then(r => setPatients(r.data)).catch(console.error);
  }, []);
 
  const handleDeleted = (id) => setAppointments(prev => prev.filter(a => a.id !== id));
 
  const visible = appointments.filter(a => {
    if (filter === 'upcoming')  return isUpcoming(a.day);
    if (filter === 'completed') return !isUpcoming(a.day);
    return true;
  });
 
  const TAB = (label, value) => (
    <button
      onClick={() => setFilter(value)}
      style={{
        padding: '6px 14px', fontSize: 12, fontWeight: 600,
        borderRadius: 6, border: '1px solid',
        cursor: 'pointer', transition: 'all 0.15s',
        background: filter === value ? '#1d4ed8' : '#fff',
        color:      filter === value ? '#fff'    : '#64748b',
        borderColor: filter === value ? '#1d4ed8' : '#e2e8f0',
      }}
    >{label}</button>
  );
 
  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#0f172a' }}>Appointment Schedule</h1>
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 13 }}>
            {loading ? 'Loading…' : `${appointments.filter(a => isUpcoming(a.day)).length} upcoming · ${appointments.length} total`}
          </p>
        </div>
        <button
          onClick={() => setShowForm(v => !v)}
          style={{
            background: '#1d4ed8', color: '#fff', border: 'none',
            borderRadius: 8, padding: '9px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer',
          }}
        >
          {showForm ? '✕ Close' : '+ Book Appointment'}
        </button>
      </div>
 
      {/* Add form */}
      {showForm && (
        <AddAppointmentForm
          doctors={doctors}
          patients={patients}
          onAdded={() => { fetchAppointments(); setShowForm(false); }}
        />
      )}
 
      {/* Error */}
      {error && (
        <div style={{
          background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8,
          padding: '12px 16px', marginBottom: 20, color: '#b91c1c', fontSize: 13,
        }}>{error}</div>
      )}
 
      {/* Filter tabs */}
      {!loading && (
        <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
          {TAB('All', 'all')}
          {TAB('Upcoming', 'upcoming')}
          {TAB('Completed', 'completed')}
        </div>
      )}
 
      {/* Loading skeletons */}
      {loading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{
              height: 200, borderRadius: 14, border: '1px solid #e2e8f0',
              background: 'linear-gradient(90deg, #f1f5f9 25%, #e8edf2 50%, #f1f5f9 75%)',
              backgroundSize: '300% 100%',
            }} />
          ))}
        </div>
      )}
 
      {/* Cards */}
      {!loading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {visible.map(appt => (
            <AppointmentCard key={appt.id} appt={appt} onDelete={handleDeleted} />
          ))}
 
          {visible.length === 0 && (
            <div style={{
              gridColumn: '1 / -1', textAlign: 'center', padding: '60px 20px',
              color: '#94a3b8', fontSize: 13,
              background: '#fff', border: '1px dashed #e2e8f0', borderRadius: 14,
            }}>
              {filter === 'all'
                ? 'No appointments yet — click + Book Appointment to start.'
                : `No ${filter} appointments.`}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
 
export default Schedule;