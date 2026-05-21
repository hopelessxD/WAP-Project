import React from 'react';

function SubjectCard({ subject, onSelect }) {
  return (
    <div 
      className="sub-card" 
      onClick={() => onSelect(subject)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onSelect(subject);
        }
      }}
    >
      <span className="sub-code">{subject.code}</span>
      <h3 className="sub-name">{subject.name}</h3>
      <div className="sub-footer">
        <span className="sub-tag">Resources</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </div>
    </div>
  );
}

export default SubjectCard;