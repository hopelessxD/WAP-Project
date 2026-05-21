import React, { useState } from 'react';
import SemesterSection from './components/SemesterSection';
import ResourceModal from './components/ResourceModal';
import './App.css';

const DATA = {
  "First year": [
    {
      key: "firstSem", label: "1st semester", subjects: [
        { code: "ENSH 101", name: "Engineering Mathematics I" },
        { code: "ENCT 101", name: "Computer Programming" },
        { code: "ENME 101", name: "Engineering Drawing" },
        { code: "ENEX 101", name: "Fundamental of Electrical and Electronics Engineering" },
        { code: "ENSH 102", name: "Engineering Physics" },
        { code: "ENME 106", name: "Engineering Workshop" }
      ]
    },
    {
      key: "secondSem", label: "2nd semester", subjects: [
        { code: "ENSH 151", name: "Engineering Mathematics II" },
        { code: "ENCT 151", name: "Object Oriented Programming" },
        { code: "ENEX 152", name: "Digital Logic" },
        { code: "ENEX 151", name: "Electronic Device and Circuits" },
        { code: "ENSH 153", name: "Engineering Chemistry" },
        { code: "ENEE 154", name: "Electrical Circuits and Machines" }
      ]
    }
  ],
  "Second year": [
    {
      key: "thirdSem", label: "3rd semester", subjects: [
        { code: "ENSH 201", name: "Engineering Mathematics III" },
        { code: "ENSH 204", name: "Communication English" },
        { code: "ENCT 201", name: "Computer Graphics and Visualization" },
        { code: "ENCT 202", name: "Foundation of Data Science" },
        { code: "ENCT 203", name: "Theory of Computation" },
        { code: "ENEX 201", name: "Microprocessors" }
      ]
    },
    {
      key: "fourthSem", label: "4th semester", subjects: [
        { code: "ENSH 252", name: "Numerical Methods" },
        { code: "ENEX 252", name: "Instrumentation" },
        { code: "ENEX 254", name: "Electromagnetics" },
        { code: "ENCT 252", name: "Data Structure and Algorithm" },
        { code: "ENCT 253", name: "Data Communication" },
        { code: "ENCT 254", name: "Operating System" }
      ]
    }
  ],
  "Third year": [
    {
      key: "fifthSem", label: "5th semester", subjects: [
        { code: "ENSH 304", name: "Probability and Statistics" },
        { code: "ENCT 301", name: "Database Management System" },
        { code: "ENCT 302", name: "Web Application Programming" },
        { code: "ENCT 303", name: "Computer Organization and Architecture" },
        { code: "ENCT 304", name: "Computer Networks" },
        { code: "ENCT 325-344", name: "Elective I" }
      ]
    },
    {
      key: "sixthSem", label: "6th semester", subjects: [
        { code: "ENCE 356", name: "Engineering Economics" },
        { code: "ENCT 351", name: "Artificial Intelligence" },
        { code: "ENCT 352", name: "Software Engineering" },
        { code: "ENCT 353", name: "Simulation and Modeling" },
        { code: "ENCT 354", name: "Minor Project" },
        { code: "ENCT 385-399", name: "Elective II" }
      ]
    }
  ],
  "Fourth year": [
    {
      key: "seventhSem", label: "7th semester", subjects: [
        { code: "ENEX 416", name: "Digital Signal Analysis and Processing" },
        { code: "ENCT 411", name: "Distributed and Cloud Computing" },
        { code: "ENCT 412", name: "ICT Project Management" },
        { code: "ENEX 417", name: "Energy, Environment and Social Engineering" },
        { code: "ENCT 435-444", name: "Elective III" },
        { code: "ENCT 413", name: "Project I" }
      ]
    },
    {
      key: "eighthSem", label: "8th semester", subjects: [
        { code: "ENCT 463", name: "Network and Cyber Security" },
        { code: "ENCT 465-474", name: "Elective IV" },
        { code: "ENCT 462", name: "Internship" },
        { code: "ENCT 461", name: "Project II" }
      ]
    }
  ]
};

function App() {
  const [search, setSearch] = useState("");
  const [selectedSubject, setSelectedSubject] = useState(null);

  // Helper calculation function to check if global search matches anything
  const hasMatches = Object.values(DATA).flat().some(sem =>
    sem.subjects.some(sub =>
      sub.name.toLowerCase().includes(search.toLowerCase()) ||
      sub.code.toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <div className="hub">
      <header className="hub-header">
        <div className="header-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
            <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
          </svg>
        </div>
        <div>
          <h1>IOE Resource Hub</h1>
          <p>Syllabus, past questions and materials</p>
        </div>
      </header>

      <div className="search-wrap">
        <input 
          type="text" 
          placeholder="Search subjects by name or code..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </div>

      <main className="dashboard-layout">
        {Object.entries(DATA).map(([yearName, semesters]) => {
          // Check if any semester inside this academic year has valid matching items
          const yearHasMatches = semesters.some(sem =>
            sem.subjects.some(sub =>
              sub.name.toLowerCase().includes(search.toLowerCase()) ||
              sub.code.toLowerCase().includes(search.toLowerCase())
            )
          );

          if (!yearHasMatches && search !== "") return null;

          return (
            <div key={yearName}>
              <div className="year-label">{yearName}</div>
              {semesters.map((sem, index) => {
                // Filter the current semester's subjects list based on active input
                const filteredSubjects = sem.subjects.filter(sub =>
                  sub.name.toLowerCase().includes(search.toLowerCase()) ||
                  sub.code.toLowerCase().includes(search.toLowerCase())
                );

                return (
                  <SemesterSection
                    key={sem.key}
                    label={sem.label}
                    subjects={filteredSubjects}
                    defaultOpen={search !== "" || (yearName === "First year" && index === 0)}
                    onSelectSubject={setSelectedSubject}
                  />
                );
              })}
            </div>
          );
        })}

        {!hasMatches && (
          <div className="no-results">
            No matching subjects found for "{search}"
          </div>
        )}
      </main>

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