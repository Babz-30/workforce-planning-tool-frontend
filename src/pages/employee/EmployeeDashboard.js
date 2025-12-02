import React, { useState } from 'react';
import './EmployeeDashboard.css';
import { Bell, Settings, LogOut } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import PublishedProjects from './PublishedProjects';
import Suggestions from './Suggestions';
import AssignedProjects from './AssignedProjects';

export default function EmployeeDashboard() {
  const navigate = useNavigate();
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
    },
    {
      id: 2,
      description: 'Mobile App Redesign',
      taskDescription: 'Complete redesign of mobile application with enhanced user experience',
      startDate: '2024-11-20',
      endDate: '2025-02-28',
      requiredEmployees: 3,
      roles: ['Mobile Dev', 'UI Designer'],
      competencies: ['React Native', 'Figma', 'Firebase'],
      capacity: 35,
      location: 'Remote',
      isPublished: true,
      publishedDate: '2024-11-22'
    },
    {
      id: 3,
      description: 'CRM System Integration',
      taskDescription: 'Integrate CRM system with existing enterprise tools and databases',
      startDate: '2024-12-10',
      endDate: '2025-04-30',
      requiredEmployees: 4,
      roles: ['Backend Dev', 'DevOps', 'QA Engineer'],
      competencies: ['Python', 'SQL', 'Docker', 'Kubernetes'],
      capacity: 40,
      location: 'San Francisco, CA',
      isPublished: true,
      publishedDate: '2024-11-18'
    },
    {
      id: 4,
      description: 'Data Analytics Dashboard',
      taskDescription: 'Create comprehensive analytics dashboard for business intelligence',
      startDate: '2024-12-05',
      endDate: '2025-03-20',
      requiredEmployees: 3,
      roles: ['Frontend Dev', 'Data Analyst'],
      competencies: ['React', 'D3.js', 'Python', 'Tableau'],
      capacity: 35,
      location: 'Remote',
      isPublished: true,
      publishedDate: '2024-11-23'
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
    },
    {
      id: 2,
      from: 'Mike Chen',
      project: 'Mobile App Redesign',
      suggestion: 'Implement dark mode for better accessibility',
      date: '2024-11-14',
      priority: 'High'
    },
    {
      id: 3,
      from: 'Emma Davis',
      project: 'CRM Integration',
      suggestion: 'Add export functionality for reports',
      date: '2024-11-13',
      priority: 'Low'
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
    },
    {
      id: 2,
      title: 'API Documentation',
      assignedBy: 'Mike Chen',
      deadline: '2024-11-25',
      progress: 40,
      priority: 'Medium',
      status: 'In Progress'
    },
    {
      id: 3,
      title: 'User Authentication Update',
      assignedBy: 'Emma Davis',
      deadline: '2024-12-10',
      progress: 20,
      priority: 'Low',
      status: 'Not Started'
    }
  ]);

  const handleLogout = () => {
    localStorage.removeItem("loginResponse");
    sessionStorage.clear();
    navigate("/", { replace: true });
    toast.success("You've been logged out", {
      autoClose: 2000,
      position: "top-right"
    });
  };

  return (
    <div className="employee-dashboard-page">
      {/* Header with Welcome Message and Logout */}
      <div className="dashboard-header">
        <div className="dashboard-header-content">
          <div className="welcome-section">
            <h1 className="dashboard-main-title">Employee Dashboard</h1>
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
                Assigned Projects
              </button>
            </nav>
          </div>
          <div className="header-actions">
            <button className="icon-btn" title="Notifications">
              <Bell size={20} />
            </button>
            <button className="icon-btn" title="Settings" onClick={() => {
              const employeeData = JSON.parse(localStorage.getItem("loginResponse"));
              if (employeeData) {
                navigate("/update-employee", { state: { employeeData, from: "employee"}, replace: true });
              } else {
                console.error("No employee data in localStorage");
              }
            }}>
              <Settings size={20} />
            </button>
            <button className="logout-btn" onClick={handleLogout}>
              <LogOut size={18} />
              Logout
            </button>
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