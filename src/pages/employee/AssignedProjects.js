import React from 'react';

export default function AssignedProjects({ assignedProjects }) {
  return (
    <div className="employee-container">
      <div className="employee-header">
        <h2 style={{ color: "#1e3a8a",  fontSize: "26px" }} className="employee-title">Assigned Projects</h2>
        <p className="employee-subtitle">Track your current project assignment</p>
      </div>

      <div className="assigned-container">
        {assignedProjects.map((project) => (
          <div key={project.id} className="assigned-card">
            <div className="assigned-header">
              <div>
                <h3 className="assigned-title">{project.title}</h3>
                <p className="assigned-meta">Assigned by: <strong>{project.assignedBy}</strong></p>
              </div>
              <div className="assigned-badges">
                <span className={`status-badge status-${project.status.toLowerCase().replace(' ', '-')}`}>
                  {project.status}
                </span>
                <span className={`priority-badge priority-${project.priority.toLowerCase()}`}>
                  {project.priority}
                </span>
              </div>
            </div>
            <div className="progress-section">
              <div className="progress-header">
                <span className="progress-label">Progress</span>
                <span className="progress-value">{project.progress}%</span>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: `${project.progress}%` }} />
              </div>
            </div>
            <p className="assigned-deadline">⏰ Deadline: <strong>{project.deadline}</strong></p>
          </div>
        ))}
      </div>
    </div>
  );
}