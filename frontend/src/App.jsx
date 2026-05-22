import React, { useState, useEffect } from "react";
import SemesterSection from "./components/SemesterSection";
import ResourceModal from "./components/ResourceModal";
import PatientForm from "./components/PatientForm";
import "./App.css";

function App() {
  const [data, setData] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [patients, setPatients] = useState([]);
  const [showCreate, setShowCreate] = useState(false);

  const fetchPatients = () => {
    fetch("http://localhost:5000/api/patients/")
      .then((res) => res.json())
      .then((json) => {
        const list = Array.isArray(json) ? json : json.results || [];
        setPatients(list);
        const subjects = list.map((p) => ({
          code: p.patient_id,
          name: p.full_name || p.name || `Patient ${p.patient_id}`,
        }));
        const transformed = {
          Patients: [{ key: "patients", label: "Patients", subjects }],
        };
        setData(transformed);
      })
      .catch((err) => console.error("Error fetching data:", err));
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  if (!data) return <div>Loading...</div>;

  return (
    <div className="hub">
      <div style={{ padding: 12 }}>
        <button onClick={() => setShowCreate(true)}>Add Patient</button>
        <span style={{ marginLeft: 12 }}>{patients.length} patients</span>
      </div>
      {/* ... keep your header and search logic here ... */}

      <main className="dashboard-layout">
        {Object.entries(data).map(([yearName, semesters]) => (
          <div key={yearName}>
            <div className="year-label">{yearName}</div>
            {semesters.map((sem) => (
              <SemesterSection
                key={sem.key}
                label={sem.label}
                subjects={sem.subjects}
                onSelectSubject={setSelectedSubject} // This now updates the state
              />
            ))}
          </div>
        ))}
      </main>

      {/* THIS IS THE MISSING PIECE: It triggers when selectedSubject is not null */}
      {selectedSubject && (
        <ResourceModal
          subject={selectedSubject}
          onClose={() => setSelectedSubject(null)}
        />
      )}

      {showCreate && (
        <PatientForm
          onCreate={() => {
            fetchPatients();
          }}
          onClose={() => setShowCreate(false)}
        />
      )}
    </div>
  );
}

export default App;
