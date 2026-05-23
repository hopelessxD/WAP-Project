import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import PatientTable from './components/PatientTable';
import DoctorList from './pages/DoctorList'; // 1. Import your component
import Schedule from './pages/Schedule';

function App() {
  return (
    <Router>
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <nav style={{ width: '200px', padding: '20px', background: '#f4f4f4' }}>
          <h3>Hospital System</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li><Link to="/patients">Patients</Link></li>
            <li><Link to="/doctors">Doctors</Link></li>
            <li><Link to="/schedule">Schedule</Link></li>
          </ul>
        </nav>

        <main style={{ padding: '20px', flexGrow: 1 }}>
          <Routes>
            <Route path="/patients" element={<PatientTable />} />
            <Route path="/doctors" element={<DoctorList />} /> 
            <Route path="/schedule" element={<Schedule />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;