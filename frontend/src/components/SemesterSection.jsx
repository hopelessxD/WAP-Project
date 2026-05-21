import React, { useState } from 'react';
import SubjectCard from './SubjectCard';

function SemesterSection({ label, subjects, defaultOpen, onSelectSubject }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  // If search filtering empties a semester, we don't display the block at all
  if (subjects.length === 0) return null;

  return (
    <div className="sem-block">
      <div className="sem-header" onClick={() => setIsOpen(!isOpen)}>
        <div className="sem-left">
          <span className="sem-badge">IOE</span>
          <h2 className="sem-title">{label}</h2>
        </div>
        <div className="sem-right">
          <span className="sem-count">{subjects.length} {subjects.length === 1 ? 'subject' : 'subjects'}</span>
          <svg 
            className={`chevron ${isOpen ? 'open' : ''}`} 
            width="18" 
            height="18" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>

      {isOpen && (
        <div className="subject-grid">
          {subjects.map((subject) => (
            <SubjectCard 
              key={subject.code} 
              subject={subject} 
              onSelect={onSelectSubject} 
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default SemesterSection;