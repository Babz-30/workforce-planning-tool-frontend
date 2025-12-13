import React from 'react';

export default function Suggestions({ suggestions }) {
  const handleAcceptSuggestion = (id) => {
    alert(`Suggestion ${id} accepted and added to backlog!`);
    // TODO: Replace with actual API call
    // Example: await acceptSuggestion(id);
  };

  const handleRejectSuggestion = (id) => {
    alert(`Suggestion ${id} rejected!`);
    // TODO: Replace with actual API call
    // Example: await rejectSuggestion(id);
  };

  return (
    <div className="employee-container">
      <div className="employee-header">
        <h2 style={{ color: "#1e3a8a",  fontSize: "26px" }} className="employee-title">Accept Suggestions</h2>
        <p className="employee-subtitle">Review and respond to suggestions</p>
      </div>

      <div className="suggestions-container">
        {suggestions.map((suggestion) => (
          <div key={suggestion.id} className="suggestion-card">
            <div className="suggestion-header">
              <div className="suggestion-info">
                <div className="suggestion-title-row">
                  <h3 className="suggestion-project">{suggestion.project}</h3>
                  <span className={`priority-badge priority-${suggestion.priority.toLowerCase()}`}>
                    {suggestion.priority}
                  </span>
                </div>
                <p className="suggestion-meta">
                  From: <strong>{suggestion.from}</strong> • {suggestion.date}
                </p>
                <p className="suggestion-text">{suggestion.suggestion}</p>
              </div>
            </div>
            <div className="suggestion-actions">
              <button
                onClick={() => handleAcceptSuggestion(suggestion.id)}
                className="btn-accept"
              >
                ✓ Accept
              </button>
              <button
                onClick={() => handleRejectSuggestion(suggestion.id)}
                className="btn-reject"
              >
                ✕ Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}