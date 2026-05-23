import React, { useState } from 'react';
 
// ─── Helpers ──────────────────────────────────────────────────────────────────
 
function Badge({ children, color = 'blue' }) {
  const colors = {
    blue:   { bg: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe' },
    green:  { bg: '#f0fdf4', text: '#15803d', border: '#bbf7d0' },
    amber:  { bg: '#fffbeb', text: '#b45309', border: '#fde68a' },
    red:    { bg: '#fef2f2', text: '#b91c1c', border: '#fecaca' },
    purple: { bg: '#f5f3ff', text: '#6d28d9', border: '#ddd6fe' },
    gray:   { bg: '#f8fafc', text: '#475569', border: '#e2e8f0' },
  };
  const c = colors[color] || colors.gray;
  return (
    <span style={{
      background: c.bg, color: c.text, border: `1px solid ${c.border}`,
      borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 600,
      whiteSpace: 'nowrap',
    }}>{children}</span>
  );
}
 
function statusColor(status) {
  const s = (status || '').toLowerCase();
  if (s === 'admitted')   return 'green';
  if (s === 'discharged') return 'gray';
  if (s === 'critical')   return 'red';
  return 'blue';
}
 
function bmiCategory(bmi) {
  const b = parseFloat(bmi);
  if (!b)       return null;
  if (b < 18.5) return { label: 'Underweight', color: 'amber' };
  if (b < 25)   return { label: 'Normal',      color: 'green' };
  if (b < 30)   return { label: 'Overweight',  color: 'amber' };
  return          { label: 'Obese',           color: 'red'   };
}
 
// Consistent avatar color per patient
const PALETTES = [
  { bg: '#eff6ff', text: '#1d4ed8' },
  { bg: '#f0fdf4', text: '#15803d' },
  { bg: '#fdf4ff', text: '#7e22ce' },
  { bg: '#fff7ed', text: '#c2410c' },
  { bg: '#f0fdfa', text: '#0f766e' },
  { bg: '#fef2f2', text: '#b91c1c' },
];
 
function Avatar({ name, id }) {
  const initials = (name || '??').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const p = PALETTES[(id || 0) % PALETTES.length];
  return (
    <div style={{
      width: 40, height: 40, borderRadius: '50%',
      background: p.bg, color: p.text,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 13, fontWeight: 700, flexShrink: 0,
      border: '2px solid #fff', boxShadow: '0 0 0 1px #e2e8f0',
    }}>{initials}</div>
  );
}
 
// ─── Single patient card ──────────────────────────────────────────────────────
 
function PatientCard({ patient: p, deletePatient }) {
  const [expanded,  setExpanded]  = useState(false);
  const [deleting,  setDeleting]  = useState(false);
  const bmi = bmiCategory(p.bmi);
 
  const handleDelete = async () => {
    if (!window.confirm(`Remove ${p.full_name}?`)) return;
    setDeleting(true);
    try {
      await deletePatient(p.patient_id);
    } catch {
      setDeleting(false);
    }
  };
 
  return (
    <div style={{
      background: '#fff',
      border: '1px solid #e2e8f0',
      borderRadius: 14,
      overflow: 'hidden',
      transition: 'box-shadow 0.15s ease',
    }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
    >
      {/* ── Collapsed header (always visible, clickable) ── */}
      <div
        onClick={() => setExpanded(v => !v)}
        style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '14px 16px', cursor: 'pointer',
          userSelect: 'none',
        }}
      >
        <Avatar name={p.full_name} id={p.patient_id} />
 
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, color: '#0f172a', fontSize: 14, marginBottom: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {p.full_name}
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <Badge color="blue">{p.blood_group || '—'}</Badge>
            <Badge color={statusColor(p.status)}>{p.status || '—'}</Badge>
          </div>
        </div>
 
        {/* Age + chevron */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500 }}>{p.age} yrs</span>
          <span style={{
            fontSize: 11, color: '#94a3b8',
            transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease', display: 'inline-block',
          }}>▼</span>
        </div>
      </div>
 
      {/* ── Expanded detail panel ── */}
      {expanded && (
        <div style={{ borderTop: '1px solid #f1f5f9', padding: '16px' }}>
 
          {/* Detail grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 20px', marginBottom: 14 }}>
            <DetailRow label="Patient ID" value={`#${p.patient_id}`} />
            <DetailRow label="Age"         value={`${p.age} years`} />
            <DetailRow label="Blood Group" value={p.blood_group || '—'} />
            <DetailRow
              label="BMI"
              value={
                p.bmi
                  ? <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontWeight: 600, color: '#0f172a' }}>{p.bmi}</span>
                      {bmi && <Badge color={bmi.color}>{bmi.label}</Badge>}
                    </span>
                  : '—'
              }
            />
            <DetailRow label="Contact" value={p.contact_number || '—'} />
            <DetailRow label="Status"  value={<Badge color={statusColor(p.status)}>{p.status || '—'}</Badge>} />
          </div>
 
          {/* Diagnosis */}
          {p.diagnosis && (
            <div style={{
              background: '#f8fafc', border: '1px solid #e2e8f0',
              borderRadius: 8, padding: '10px 12px', marginBottom: 14,
            }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
                Diagnosis
              </div>
              <div style={{ fontSize: 13, color: '#334155', lineHeight: 1.5 }}>{p.diagnosis}</div>
            </div>
          )}
 
          {/* Actions */}
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={handleDelete}
              disabled={deleting}
              style={{
                background: '#fef2f2', color: '#b91c1c',
                border: '1px solid #fecaca', borderRadius: 6,
                padding: '6px 14px', fontSize: 12, fontWeight: 600,
                cursor: deleting ? 'not-allowed' : 'pointer',
                opacity: deleting ? 0.6 : 1,
              }}
            >
              {deleting ? 'Removing…' : 'Delete Patient'}
            </button>
            <button
              onClick={() => setExpanded(false)}
              style={{
                background: '#f1f5f9', color: '#475569',
                border: '1px solid #e2e8f0', borderRadius: 6,
                padding: '6px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer',
              }}
            >
              Collapse
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
 
function DetailRow({ label, value }) {
  return (
    <div>
      <div style={{ fontSize: 10, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>
        {label}
      </div>
      <div style={{ fontSize: 13, color: '#1e293b', fontWeight: 500 }}>{value}</div>
    </div>
  );
}
 
// ─── Grid of cards ────────────────────────────────────────────────────────────
 
const PatientTable = ({ patients, loading, deletePatient }) => {
  if (loading) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} style={{
            height: 76, borderRadius: 14, border: '1px solid #e2e8f0',
            background: 'linear-gradient(90deg, #f1f5f9 25%, #e8edf2 50%, #f1f5f9 75%)',
            backgroundSize: '300% 100%',
          }} />
        ))}
      </div>
    );
  }
 
  if (patients.length === 0) {
    return (
      <div style={{
        textAlign: 'center', padding: '60px 20px',
        background: '#fff', border: '1px dashed #e2e8f0', borderRadius: 14,
        color: '#94a3b8', fontSize: 13,
      }}>
        No patients found.
      </div>
    );
  }
 
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
      {patients.map(p => (
        <PatientCard key={p.patient_id} patient={p} deletePatient={deletePatient} />
      ))}
    </div>
  );
};
 
export default PatientTable;