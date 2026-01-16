import React, { useState, useEffect } from 'react';
import './EmployeeProfiles.css';
import { User, Mail, Briefcase, CheckCircle, XCircle, X, MapPin, Clock } from 'lucide-react';
import { getDepartmentEmployees } from '../../services/department/departmentDashboardApi';
import { toast } from 'react-toastify';

export default function EmployeeProfiles() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, available, not-available

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      
      const response = await getDepartmentEmployees();
      setEmployees(response.data);
      
    } catch (error) {
      console.error('Error fetching employees:', error);
      toast.error('Failed to load employees. Please try again.', {
        autoClose: 3000,
        position: 'top-right',
      });
    } finally {
      setLoading(false);
    }
  };

  const getAvailabilityClass = (availability) => {
    return availability === 'AVAILABLE' ? 'availability-available' : 'availability-not-available';
  };

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (filterStatus === 'all') return matchesSearch;
    if (filterStatus === 'available') return matchesSearch && emp.availability === 'AVAILABLE';
    if (filterStatus === 'not-available') return matchesSearch && (emp.availability === 'NOT_AVAILABLE' || emp.availability === 'PARTIALLY_AVAILABLE');
    
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="dept-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading employees...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dept-container">
      <div className="dept-header">
        <h2 style={{ color: "#1e3a8a", fontSize: "26px" }} className="dept-title">
          Employee Profiles
        </h2>
        <p className="dept-subtitle">View skills and availability of your team members</p>
      </div>

      {/* Search and Filter Section */}
      <div className="search-filter-section">
        <div className="search-input-wrapper">
          <input
            type="text"
            className="search-input"
            placeholder="Search by name, role, or skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              className="clear-search-btn"
              onClick={() => setSearchQuery('')}
              title="Clear search"
              aria-label="Clear search"
            >
              <X size={18} />
            </button>
          )}
        </div>
        
        <div className="status-filter-buttons">
          <button 
            className={`filter-status-btn ${filterStatus === 'all' ? 'active' : ''}`}
            onClick={() => setFilterStatus('all')}
          >
            All ({employees.length})
          </button>
          <button 
            className={`filter-status-btn ${filterStatus === 'available' ? 'active' : ''}`}
            onClick={() => setFilterStatus('available')}
          >
            Available ({employees.filter(e => e.availability === 'AVAILABLE').length})
          </button>
          <button 
            className={`filter-status-btn ${filterStatus === 'not-available' ? 'active' : ''}`}
            onClick={() => setFilterStatus('not-available')}
          >
            Not Available ({employees.filter(e => e.availability === 'NOT_AVAILABLE' || e.availability === 'PARTIALLY_AVAILABLE').length})
          </button>
        </div>
      </div>

      {/* Employee Grid */}
      <div className="employee-grid">
        {filteredEmployees.map((employee) => (
          <div key={employee.id} className="employee-card">
            <div className="employee-card-header">
              <div className="employee-avatar">
                <User size={24} color="#3b82f6" />
              </div>
              <span className={`availability-badge ${getAvailabilityClass(employee.availability)}`}>
                {employee.availability === 'AVAILABLE' ? <CheckCircle size={14} /> : <XCircle size={14} />}
                {employee.availability.replace('_', ' ')}
              </span>
            </div>

            <div className="employee-info">
              <h3 className="employee-name">{employee.name} (EmpId: {employee.id})</h3>
              <div className="employee-detail">
                <Mail size={14} />
                <span>{employee.email}</span>
              </div>
              <div className="employee-detail">
                <Briefcase size={14} />
                <span>{employee.role}</span>
              </div>
              <div className="employee-detail">
                <MapPin size={14} />
                <span>{employee.location}</span>
              </div>
              <div className="employee-detail">
                <Clock size={14} />
                <span>{employee.capacity} hours/week</span>
              </div>
            </div>

            <div className="skills-section">
              <span className="skills-label">Skills</span>
              <div className="skills-chips">
                {employee.skills.slice(0, 4).map((skill, index) => (
                  <span key={index} className="skill-chip employee-skill-chip">{skill}</span>
                ))}
                {employee.skills.length > 4 && (
                  <span className="skill-chip-more">+{employee.skills.length - 4}</span>
                )}
              </div>
            </div>

            <div className="current-project-section">
              <span className="project-label">Current Project</span>
              {employee.currentProject ? (
                <div className="project-assigned">
                  <div className="project-dot"></div>
                  <span className="project-name">{employee.currentProject}</span>
                </div>
              ) : (
                <div className="project-none">
                  <span className="no-project-text">No active project</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredEmployees.length === 0 && (
        <div className="no-results">
          <p className="no-results-text">No employees found matching your search.</p>
        </div>
      )}
    </div>
  );
}