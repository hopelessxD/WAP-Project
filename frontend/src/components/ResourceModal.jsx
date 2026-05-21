import React, { useState, useEffect } from 'react';

function ResourceModal({ subject, onClose }) {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Fetch from your backend route
    fetch(`http://localhost:5000/api/subjects/${subject.code}/resources`)
      .then(res => res.json())
      .then(data => {
        // Assuming your backend returns { subject, resources: [...] }
        setResources(data.resources || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  }, [subject.code]);

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div className="modal-code">{subject.code}</div>
          <h2 className="modal-title">{subject.name}</h2>
        </div>
        
        <div className="modal-body">
          {loading ? <p>Loading resources...</p> : (
            resources.length > 0 ? resources.map((r, i) => (
              <div key={i} className="res-item">
                <div className="res-text">
                  <strong>{r.title}</strong>
                  <span>{r.type}</span>
                </div>
                <a href={r.fileUrl} target="_blank" rel="noopener noreferrer">Open</a>
              </div>
            )) : <p>No resources found for this subject yet.</p>
          )}
        </div>
        
        <div className="modal-footer">
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

export default ResourceModal;