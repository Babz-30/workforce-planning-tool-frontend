import React, { useState, useEffect } from 'react';
import './Suggestions.css';
import { toast } from 'react-toastify';
import { Calendar, MapPin, Users, Briefcase } from 'lucide-react';
import { getSuggestedProjects, acceptSuggestion } from '../../services/employee/suggestedProjectAPI';

export default function Suggestions() {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  const profileData = JSON.parse(localStorage.getItem("loginResponse"));
  const employeeId = profileData?.employeeId;

  const fetchSuggestedProjects = async () => {
    try {
      setLoading(true);
      const data = await getSuggestedProjects(employeeId);
      // Filter only projects with SUGGESTED status
      const suggestedOnly = data.filter(item =>
        item.application.currentStatus === 'SUGGESTED'
      );
      setSuggestions(suggestedOnly);
    } catch (error) {
      console.error('Error fetching suggested projects:', error);
      toast.error('Failed to load suggested projects', {
        position: 'top-right',
        autoClose: 3000
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuggestedProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAcceptSuggestion = async (applicationId) => {
    try {
      setProcessingId(applicationId);

      await acceptSuggestion(applicationId, employeeId);

      toast.success('Suggestion accepted successfully!', {
        position: 'top-right',
        autoClose: 3000
      });

      fetchSuggestedProjects();
    } catch (error) {
      console.error('Error accepting suggestion:', error);
      toast.error('Failed to accept suggestion', {
        position: 'top-right',
        autoClose: 3000
      });
    } finally {
      setProcessingId(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getAllRoles = (roles) => {
    if (!roles || roles.length === 0) return [];
    return roles.map(role => role.requiredRole).filter(Boolean);
  };

  const getAllCompetencies = (roles) => {
    if (!roles || roles.length === 0) return [];
    const allCompetencies = roles.flatMap(role => role.requiredCompetencies || []);
    return [...new Set(allCompetencies)];
  };

  const getCapacityForRole = (roles, projectRole) => {
    if (!roles || roles.length === 0 || !projectRole) return 0;
    const matchingRole = roles.find(role => role.requiredRole === projectRole);
    return matchingRole ? parseInt(matchingRole.capacity) || 0 : 0;
  };

  if (loading) {
    return (
      <div className="employee-container">
        <div className="employee-header">
          <h2 style={{ color: "#1e3a8a", fontSize: "26px" }} className="employee-title">
            Project Suggestions
          </h2>
          <p className="employee-subtitle">Review and respond to project suggestions</p>
        </div>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading suggestions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="employee-container suggestions-page">
      <div className="employee-header">
        <h2 style={{ color: "#1e3a8a", fontSize: "26px" }} className="employee-title">
          Project Suggestions
        </h2>
        <p className="employee-subtitle">
          Review and respond to project suggestions ({suggestions.length} pending)
        </p>
      </div>

      {suggestions.length === 0 ? (
        <div className="no-projects-container">
          <div className="no-projects-icon">📋</div>
          <h3 className="no-projects-title">No Suggestions Available</h3>
          <p className="no-projects-text">
            You don't have any pending project suggestions at the moment.
          </p>
        </div>
      ) : (
        <div className="assigned-container">
          {suggestions.map((item) => {
            const { application, project } = item;
            const allRoles = getAllRoles(project.roles);
            const allCompetencies = getAllCompetencies(project.roles);

            return (
              <div key={application.id} className="assigned-card">
                <div className="assigned-header">
                  <div className="assigned-title-section">
                    <h3 className="assigned-title">{project.projectDescription}</h3>
                    <p className="assigned-description">{project.taskDescription || 'No description provided'}</p>
                    <p className="assigned-meta">
                      Your Role: <strong>{application.projectRole}</strong>
                      {application.projectRole && (
                        <> • Suggested by: <strong>{application.suggestedBy?.username || 'System'}</strong></>
                      )}
                      {application.timestamps?.suggestedAt && (
                        <> • Suggested on: <strong>{formatDate(application.timestamps.suggestedAt)}</strong></>
                      )}
                    </p>
                  </div>
                  <div className="assigned-badges">
                    <span className="status-badge status-suggested">
                      SUGGESTED
                    </span>
                  </div>
                </div>

                <div className="project-details-grid">
                  {project.selectedLocations && project.selectedLocations.length > 0 && (
                    <div className="detail-item">
                      <span className="detail-label">
                        <MapPin size={14} style={{ display: 'inline', marginRight: '4px' }} />
                        LOCATIONS
                      </span>
                      <span className="detail-value-large">
                        {project.selectedLocations.join(', ')}
                      </span>
                    </div>
                  )}

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
                      REQUESTED CAPACITY
                    </span>
                    <span className="detail-value-large">
                      {getCapacityForRole(project.roles, application.projectRole) || 40} hours/week
                    </span>
                  </div>

                  <div className="detail-item">
                    <span className="detail-label">
                      <Calendar size={14} style={{ display: 'inline', marginRight: '4px' }} />
                      TIMELINE
                    </span>
                    <span className="detail-value-large">
                      {formatDate(project.projectStart)} → {formatDate(project.projectEnd)}
                    </span>
                  </div>

                  {allRoles.length > 0 && (
                    <div className="detail-item">
                      <span className="detail-label">REQUIRED ROLES</span>
                      <div className="roles-chips-container">
                        {allRoles.map((role, index) => (
                          <span key={index} className="role-chip">{role}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {project.selectedSkills && project.selectedSkills.length > 0 && (
                    <div className="detail-item">
                      <span className="detail-label">REQUIRED SKILLS</span>
                      <div className="competencies-chips-container">
                        {project.selectedSkills.map((skill, index) => (
                          <span key={index} className="competency-chip">{skill}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {allCompetencies.length > 0 && (
                    <div className="detail-item">
                      <span className="detail-label">ROLE COMPETENCIES</span>
                      <div className="competencies-chips-container">
                        {allCompetencies.map((competency, index) => (
                          <span key={index} className="competency-chip">{competency}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="suggestion-actions">
                  <button
                    onClick={() => handleAcceptSuggestion(application.applicationId)}
                    className="btn-accept"
                    disabled={processingId === application.applicationId}
                  >
                    {processingId === application.applicationId ? '⏳ Processing...' : '✓ Accept Suggestion'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}