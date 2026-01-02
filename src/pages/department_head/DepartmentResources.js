import { useState, useEffect } from "react"
import "./DepartmentResources.css"
import { Calendar, User, Mail, MapPin, Clock } from "lucide-react"
// import axios from 'axios';

export default function DepartmentResources() {
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchResources()
  }, [])

  const fetchResources = async () => {
    try {
      setLoading(true)

      // TODO: Replace with actual API call
      // const response = await axios.get('/api/department/resources');
      // setResources(response.data);

      const mockData = [
        {
          id: 1,
          employeeName: "John Smith",
          employeeEmail: "john.smith@company.com",
          role: "Senior Developer",
          employeeSkills: ["React", "Node.js", "Python", "AWS", "Docker"],
          location: "New York, NY",
          capacity: 40,
          projectName: "E-Commerce Platform",
          projectDescription: "Building a scalable e-commerce platform with modern architecture",
          projectStatus: "ACTIVE",
          startDate: "2024-12-01",
          endDate: "2025-03-15",
          requiredSkills: ["React", "Node.js", "AWS"],
          teamSize: 6,
          requiredRoles: ["Frontend Developer", "Backend Developer", "DevOps"],
          estimatedWorkload: 40,
        },
        {
          id: 2,
          employeeName: "Sarah Johnson",
          employeeEmail: "sarah.j@company.com",
          role: "UI/UX Designer",
          employeeSkills: ["Figma", "Adobe XD", "Sketch", "User Research"],
          location: "Remote",
          capacity: 35,
          projectName: "Mobile App Redesign",
          projectDescription: "Complete redesign of mobile application with improved user experience",
          projectStatus: "ACTIVE",
          startDate: "2024-11-20",
          endDate: "2025-02-28",
          requiredSkills: ["Figma", "User Research", "Prototyping"],
          teamSize: 4,
          requiredRoles: ["UI Designer", "UX Researcher"],
          estimatedWorkload: 35,
        },
        {
          id: 3,
          employeeName: "Mike Chen",
          employeeEmail: "mike.chen@company.com",
          role: "Backend Developer",
          employeeSkills: ["Java", "Spring Boot", "PostgreSQL", "Kubernetes"],
          location: "San Francisco, CA",
          capacity: 45,
          projectName: "API Gateway",
          projectDescription: "Develop centralized API gateway for microservices architecture",
          projectStatus: "ACTIVE",
          startDate: "2024-12-15",
          endDate: "2025-05-10",
          requiredSkills: ["Java", "Spring Boot", "Kubernetes"],
          teamSize: 5,
          requiredRoles: ["Backend Developer", "Solution Architect"],
          estimatedWorkload: 45,
        },
        {
          id: 4,
          employeeName: "Emma Davis",
          employeeEmail: "emma.davis@company.com",
          role: "Full Stack Developer",
          employeeSkills: ["React", "Python", "Django", "PostgreSQL"],
          location: "Austin, TX",
          capacity: 40,
          projectName: "Data Analytics Dashboard",
          projectDescription: "Create comprehensive analytics dashboard for business intelligence",
          projectStatus: "ACTIVE",
          startDate: "2024-12-05",
          endDate: "2025-03-20",
          requiredSkills: ["React", "Python", "Data Visualization"],
          teamSize: 3,
          requiredRoles: ["Full Stack Developer", "Data Analyst"],
          estimatedWorkload: 40,
        },
        {
          id: 5,
          employeeName: "David Wilson",
          employeeEmail: "david.w@company.com",
          role: "DevOps Engineer",
          employeeSkills: ["AWS", "Docker", "Kubernetes", "Terraform", "Jenkins"],
          location: "Seattle, WA",
          capacity: 38,
          projectName: "Infrastructure Setup",
          projectDescription: "Setup and configure cloud infrastructure with CI/CD pipelines",
          projectStatus: "ACTIVE",
          startDate: "2024-12-08",
          endDate: "2025-04-01",
          requiredSkills: ["AWS", "Kubernetes", "Terraform"],
          teamSize: 2,
          requiredRoles: ["DevOps Engineer"],
          estimatedWorkload: 38,
        },
      ]

      setTimeout(() => {
        setResources(mockData)
        setLoading(false)
      }, 500)
    } catch (error) {
      console.error("Error fetching resources:", error)
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  if (loading) {
    return (
      <div className="dept-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading department resources...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="dept-container">
      <div className="dept-header">
        <h2 style={{ color: "#1e3a8a", fontSize: "26px" }} className="dept-title">
          Department Resources
        </h2>
        <p className="dept-subtitle">View employee assignments and project details</p>
      </div>

      <div className="resources-grid">
        {resources.map((resource) => (
          <div key={resource.id} className="resource-card">
            <div className="resource-header">
              <div className="employee-header-info">
                <div className="employee-avatar-small">
                  <User size={20} color="#3b82f6" />
                </div>
                <div>
                  <h3 className="resource-name">{resource.employeeName}</h3>
                  <p className="resource-role">{resource.role}</p>
                </div>
              </div>
              <span className="status-badge-small status-active">{resource.projectStatus}</span>
            </div>

            <div className="employee-details-section">
              <div className="employee-detail">
                <Mail size={14} />
                <span>{resource.employeeEmail}</span>
              </div>
              <div className="employee-detail">
                <MapPin size={14} />
                <span>{resource.location}</span>
              </div>
              <div className="employee-detail">
                <Clock size={14} />
                <span>{resource.capacity} hours/week</span>
              </div>
            </div>

            <div className="skills-section">
              <span className="skills-label">Employee Skills</span>
              <div className="skills-chips">
                {resource.employeeSkills.slice(0, 4).map((skill, index) => (
                  <span key={index} className="skill-chip employee-skill-chip">
                    {skill}
                  </span>
                ))}
                {resource.employeeSkills.length > 4 && (
                  <span className="skill-chip-more">+{resource.employeeSkills.length - 4}</span>
                )}
              </div>
            </div>

            <div className="project-details-section">
              <div className="project-info">
                <span className="project-label">Assigned Project</span>
                <h4 className="project-name-large">{resource.projectName}</h4>
                <p className="project-description">{resource.projectDescription}</p>
              </div>

              <div className="project-metadata-grid">
                <div className="project-detail-item">
                  <span className="detail-label">
                    <Calendar size={14} />
                    PROJECT TIMELINE
                  </span>
                  <span className="detail-value">
                    {formatDate(resource.startDate)} → {formatDate(resource.endDate)}
                  </span>
                </div>

                <div className="project-detail-item">
                  <span className="detail-label">
                    <User size={14} />
                    TEAM SIZE
                  </span>
                  <span className="detail-value">{resource.teamSize} members</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
