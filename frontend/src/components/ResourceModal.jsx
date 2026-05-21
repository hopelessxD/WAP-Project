import React, { useEffect } from 'react';

function ResourceModal({ subject, onClose }) {
  // Prevent background body scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const resources = [
    { icon: "📄", label: "Syllabus", desc: "Official IOE course outline", color: "#eef4ff", border: "#c7d9ff" },
    { icon: "📋", label: "Past questions", desc: "Previous exam papers", color: "#fff7ee", border: "#ffd9a8" },
    { icon: "📂", label: "Study materials", desc: "Notes, slides, references", color: "#eeffed", border: "#b6f0b3" },
  ];

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div className="modal-code">{subject.code}</div>
          <h2 className="modal-title">{subject.name}</h2>
        </div>
        <div className="modal-body">
          {resources.map((r) => (
            <div key={r.label} className="res-item" style={{ background: r.color, borderColor: r.border }}>
              <div className="res-icon" style={{ background: '#fff', borderColor: r.border }}>{r.icon}</div>
              <div className="res-text">
                <strong>{r.label}</strong>
                <span>{r.desc}</span>
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </div>
          ))}
        </div>
        <div className="modal-footer">
          <button className="btn-close" onClick={onClose}>Close</button>
          <button className="btn-secondary" onClick={() => alert(`Opening resources for ${subject.code}`)}>
            View All
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResourceModal;