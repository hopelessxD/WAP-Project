import React, { useState, useEffect } from 'react';
import SemesterSection from './components/SemesterSection';
import ResourceModal from './components/ResourceModal';
import './App.css';

function App() {
  const [data, setData] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedSubject, setSelectedSubject] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/subjects')
      .then(res => res.json())
      .then(json => {
        console.log("Data received from MongoDB:", json);
        setData(json);
      })
      .catch(err => console.error("Error fetching data:", err));
  }, []);

  if (!data) return <div>Loading...</div>;

  return (
    <div className="hub">
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
    </div>
  );
}

export default App;