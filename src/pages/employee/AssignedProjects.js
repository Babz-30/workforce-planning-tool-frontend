import React, { useState, useEffect } from 'react';
import './AssignedProjects.css';
import { Calendar, MapPin, Users, Briefcase } from 'lucide-react';
// import axios from 'axios';

export default function AssignedProjects() {
  const [assignedProjects, setAssignedProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAssignedProjects();
  }, []);

  const fetchAssignedProjects = async () => {
    try {
      setLoading(true);
      const profileData = JSON.parse(localStorage.getItem("loginResponse"));

      if (!profileData || !profileData.id) {
        setError("Employee ID not found");
        setLoading(false);
        return;
      }

      // TODO: Replace mock data with actual API call
      // const response = await axios.get(`/api/assigned-projects/${profileData.id}`);
      // setAssignedProjects(response.data);

      // Mock data for now
      const mockProjects = [
        {
          id: 1,
          description: 'E-Commerce Platform Development',
          taskDescription: 'Build a scalable e-commerce platform with modern UI/UX and payment integration',
          startDate: '2024-12-01',
          endDate: '2025-03-15',
          requiredEmployees: 5,
          roles: ['Frontend Dev', 'Backend Dev', 'UI/UX Designer'],
          competencies: ['React', 'Node.js', 'MongoDB', 'AWS'],
          capacity: 40,
          location: 'New York, NY',
          assignedBy: 'Sarah Johnson',
          assignedDate: '2024-11-20',
          status: 'ACTIVE'
        },
        {
          id: 2,
          description: 'Data Analytics Dashboard',
          taskDescription: 'Create comprehensive analytics dashboard for business intelligence',
          startDate: '2024-12-05',
          endDate: '2025-03-20',
          requiredEmployees: 3,
          roles: ['Frontend Dev', 'Data Analyst'],
          competencies: ['React', 'D3.js', 'Python', 'Tableau'],
          capacity: 35,
          location: 'Remote',
          assignedBy: 'John Smith',
          assignedDate: '2024-10-15',
          status: 'COMPLETED'
        }
      ];

      // Simulate API delay
      setTimeout(() => {
        setAssignedProjects(mockProjects);
        setLoading(false);
      }, 800);

      setError(null);
    } catch (err) {
      console.error("Error fetching assigned projects:", err);
      setError("Failed to load assigned projects");
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getStatusClass = (status) => {
    if (!status) return 'status-active';
    const statusLower = status.toLowerCase();
    if (statusLower === 'completed') return 'status-completed';
    return 'status-active';
  };

  if (loading) {
    return (
      <div className="employee-container">
        <div className="employee-header">
          <h2 style={{ color: "#1e3a8a", fontSize: "26px" }} className="employee-title">
            Assigned Projects
          </h2>
          <p className="employee-subtitle">Track your current project assignment</p>
        </div>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading your projects...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="employee-container">
        <div className="employee-header">
          <h2 style={{ color: "#1e3a8a", fontSize: "26px" }} className="employee-title">
            Assigned Project
          </h2>
          <p className="employee-subtitle">Track your current project assignments</p>
        </div>
        <div className="error-container">
          <p className="error-text">⚠️ {error}</p>
        </div>
      </div>
    );
  }

  if (assignedProjects.length === 0) {
    return (
      <div className="employee-container">
        <div className="employee-header">
          <h2 style={{ color: "#1e3a8a", fontSize: "26px" }} className="employee-title">
            Assigned Project
          </h2>
          <p className="employee-subtitle">Track your current project assignments</p>
        </div>
        <div className="no-projects-container">
          <div className="no-projects-icon">📋</div>
          <h3 className="no-projects-title">No Projects Assigned</h3>
          <p className="no-projects-text">You don't have any projects assigned yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="employee-container">
      <div className="employee-header">
        <h2 style={{ color: "#1e3a8a", fontSize: "26px" }} className="employee-title">
          Assigned Project
        </h2>
        <p className="employee-subtitle">Track your current project assignments</p>
      </div>

      <div className="assigned-container">
        {assignedProjects.map((project) => (
          <div key={project.id} className="assigned-card">
            <div className="assigned-header">
              <div className="assigned-title-section">
                <h3 className="assigned-title">{project.description}</h3>
                <p className="assigned-description">{project.taskDescription}</p>
                <p className="assigned-meta">
                  Assigned by: <strong>{project.assignedBy || 'System'}</strong>
                  {project.assignedDate && (
                    <> • Assigned on: <strong>{formatDate(project.assignedDate)}</strong></>
                  )}
                </p>
              </div>
              <div className="assigned-badges">
                <span className={`status-badge ${getStatusClass(project.status)}`}>
                  {project.status || 'ACTIVE'}
                </span>
              </div>
            </div>

            <div className="project-details-grid">
              <div className="detail-item">
                <span className="detail-label">
                  <MapPin size={14} style={{ display: 'inline', marginRight: '4px' }} />
                  LOCATION
                </span>
                <span className="detail-value-large">{project.location || 'Not specified'}</span>
              </div>

              <div className="detail-item">
                <span className="detail-label">
                  <Users size={14} style={{ display: 'inline', marginRight: '4px' }} />
                  TEAM SIZE
                </span>
                <span className="detail-value-large">
                  {project.requiredEmployees || 0} {project.requiredEmployees === 1 ? 'Member' : 'Members'}
                </span>
              </div>

              <div className="detail-item">
                <span className="detail-label">
                  <Briefcase size={14} style={{ display: 'inline', marginRight: '4px' }} />
                  CAPACITY
                </span>
                <span className="detail-value-large">{project.capacity || 0} hours/week</span>
              </div>

              <div className="detail-item">
                <span className="detail-label">
                  <Calendar size={14} style={{ display: 'inline', marginRight: '4px' }} />
                  TIMELINE
                </span>

                <span className="detail-value-large">
                  {formatDate(project.startDate)} → {formatDate(project.endDate)}
                </span>
              </div>

              {project.roles && project.roles.length > 0 && (
                <div className="detail-item">
                  <span className="detail-label">REQUIRED ROLES</span>
                  <div className="roles-chips-container">
                    {project.roles.map((role, index) => (
                      <span key={index} className="role-chip">{role}</span>
                    ))}
                  </div>
                </div>
              )}

              {project.competencies && project.competencies.length > 0 && (
                <div className="detail-item">
                  <span className="detail-label">REQUIRED SKILLS</span>
                  <div className="competencies-chips-container">
                    {project.competencies.map((skill, index) => (
                      <span key={index} className="competency-chip">{skill}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}