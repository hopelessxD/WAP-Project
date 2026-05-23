import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Patients from './pages/Patients';
import DoctorList from './pages/DoctorList';
import Schedule from './pages/Schedule';
 
const NAV_ITEMS = [
  { path: '/patients', label: 'Patients', icon: '👤' },
  { path: '/doctors', label: 'Doctors', icon: '🩺' },
  { path: '/schedule', label: 'Schedule', icon: '📅' },
];
 
function Sidebar() {
  const location = useLocation();
 
  return (
    <aside style={{
      width: 220,
      minHeight: '100vh',
      background: '#0a1628',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
    }}>
      <div style={{ padding: '28px 24px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
          }}>🏥</div>
          <div>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: 13, letterSpacing: '0.02em' }}>WRC Hospital</div>
            <div style={{ color: '#64748b', fontSize: 11 }}>Hospital System</div>
          </div>
        </div>
      </div>
 
      <nav style={{ padding: '16px 12px', flex: 1 }}>
        {NAV_ITEMS.map(item => {
          const active = location.pathname === item.path || location.pathname === '/';
          const isActive = location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                width: '80%', padding: '10px 12px',
                background: isActive ? 'rgba(59,130,246,0.15)' : 'transparent',
                border: isActive ? '1px solid rgba(59,130,246,0.3)' : '1px solid transparent',
                borderRadius: 8, marginBottom: 4,
                color: isActive ? '#60a5fa' : '#94a3b8',
                fontSize: 13, fontWeight: isActive ? 600 : 400,
                textDecoration: 'none', transition: 'all 0.15s ease',
              }}
            >
              <span style={{ fontSize: 15 }}>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
 
      <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ color: '#334155', fontSize: 11 }}>v1.0.0 — MedCare</div>
      </div>
    </aside>
  );
}
 
function App() {
  return (
    <Router>
      <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', fontFamily: "'Inter', system-ui, sans-serif" }}>
        <Sidebar />
        <main style={{ flex: 1, padding: '32px 36px', overflowY: 'hidden' }}>
          <Routes>
            <Route path="/" element={<Patients />} />
            <Route path="/patients" element={<Patients />} />
            <Route path="/doctors" element={<DoctorList />} />
            <Route path="/schedule" element={<Schedule />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
 
export default App;