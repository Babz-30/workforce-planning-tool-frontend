import React, { useState } from 'react';
import './EmployeeDashboard.css';
import UserProfile from "../../components/profile/profile";
import PublishedProjects from './PublishedProjects';
import Suggestions from './Suggestions';
import AssignedProjects from './AssignedProjects';

export default function EmployeeDashboard() {
  const [activeTab, setActiveTab] = useState('published');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [tempFilters, setTempFilters] = useState({
    role: '',
    location: '',
    skills: '',
    publishedTimeRange: '',
    startDate: '',
    endDate: ''
  });
  const [filters, setFilters] = useState({
    role: '',
    location: '',
    skills: '',
    publishedTimeRange: '',
    startDate: '',
    endDate: ''
  });

  // Profile data
  const profileData = JSON.parse(localStorage.getItem("loginResponse"));

  // Mock data for published projects
  const [publishedProjects] = useState([
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
      isPublished: true,
      publishedDate: '2024-11-20'
    }
  ]);

  // Mock data for suggestions
  const [suggestions] = useState([
    {
      id: 1,
      from: 'Sarah Johnson',
      project: 'E-Commerce Platform',
      suggestion: 'Consider adding a wishlist feature for better user engagement',
      date: '2024-11-15',
      priority: 'Medium'
    }
  ]);

  // Mock data for assigned projects
  const [assignedProjects] = useState([
    {
      id: 1,
      title: 'Dashboard Analytics Module',
      assignedBy: 'Sarah Johnson',
      deadline: '2024-12-01',
      progress: 65,
      priority: 'High',
      status: 'In Progress'
    }
  ]);

  return (
    <div className="employee-dashboard-page">
      {/* Header with Welcome Message and Logout */}
      <div className="dashboard-header">
        <div className="dashboard-header-content">
          <div className="welcome-section">
            <h1 style={{ color: "#1e3a8a", fontSize: "32px" }} className="dashboard-main-title">Employee Dashboard</h1>
            <p className="welcome-text">Welcome back, <strong>{profileData.firstName}</strong></p>

            {/* Breadcrumb Navigation */}
            <nav className="breadcrumb-nav">
              <button
                onClick={() => setActiveTab('published')}
                className={`breadcrumb-item ${activeTab === 'published' ? 'active' : ''}`}
              >
                Published Projects
              </button>
              <span className="breadcrumb-separator">/</span>
              <button
                onClick={() => setActiveTab('suggestions')}
                className={`breadcrumb-item ${activeTab === 'suggestions' ? 'active' : ''}`}
              >
                Accept Suggestions
              </button>
              <span className="breadcrumb-separator">/</span>
              <button
                onClick={() => setActiveTab('assigned')}
                className={`breadcrumb-item ${activeTab === 'assigned' ? 'active' : ''}`}
              >
                Assigned Project
              </button>
            </nav>
          </div>
          <div className="app-header-actions">
            <UserProfile />
          </div>
        </div>
      </div>

      <main className="main-content">
        {activeTab === 'published' && (
          <PublishedProjects
            publishedProjects={publishedProjects}
            sortConfig={sortConfig}
            setSortConfig={setSortConfig}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            tempFilters={tempFilters}
            setTempFilters={setTempFilters}
            filters={filters}
            setFilters={setFilters}
          />
        )}
        {activeTab === 'suggestions' && <Suggestions suggestions={suggestions} />}
        {activeTab === 'assigned' && <AssignedProjects assignedProjects={assignedProjects} />}
      </main>
    </div>
  );
}