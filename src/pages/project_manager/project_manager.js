import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import "./project_manager.css";
import React, { useState } from "react";

export default function ProjectTable() {
  const [selectedProjects, setSelectedProjects] = useState([]);

  const projects = [
    {
      id: 1,
      description: "E-commerce Platform Redesign",
      startDate: "2024-01-15",
      endDate: "2024-06-30",
      taskDescription:
        "Complete overhaul of the customer-facing e-commerce platform including UX research, wireframing, UI design, frontend development with React, backend API integration, payment gateway setup, and comprehensive testing across devices.",
      requiredEmployees: 8,
      roles: [
        "UI/UX Designer",
        "Frontend Developer",
        "Backend Developer",
        "QA Engineer",
      ],
      competencies: [
        "React",
        "Node.js",
        "PostgreSQL",
        "Figma",
        "REST API",
        "Payment Integration",
      ],
      capacity:
        "Frontend: 40h/week, Backend: 35h/week, Designer: 30h/week, QA: 25h/week",
      location: "Remote / New York Office",
      links: "https://project-tracker.example.com/ecommerce",
    },
    {
      id: 2,
      description: "Mobile App Development - Healthcare",
      startDate: "2024-02-01",
      endDate: "2024-08-15",
      taskDescription:
        "Develop a cross-platform mobile application for patient appointment scheduling, telemedicine consultations, prescription management, and health record access. Includes HIPAA compliance implementation and security audits.",
      requiredEmployees: 6,
      roles: [
        "Mobile Developer",
        "Backend Developer",
        "DevOps Engineer",
        "Security Specialist",
      ],
      competencies: [
        "React Native",
        "AWS",
        "HIPAA Compliance",
        "Mobile Security",
        "CI/CD",
      ],
      capacity:
        "Mobile Dev: 40h/week, Backend: 35h/week, DevOps: 20h/week, Security: 15h/week",
      location: "Hybrid - San Francisco",
      links: "https://jira.example.com/healthcare-app",
    },
    {
      id: 3,
      description: "AI-Powered Analytics Dashboard",
      startDate: "2024-03-10",
      endDate: "2024-09-30",
      taskDescription:
        "Build an intelligent analytics dashboard that uses machine learning to provide predictive insights, automated reporting, data visualization, and real-time monitoring. Integration with multiple data sources and custom ML model training.",
      requiredEmployees: 10,
      roles: [
        "Data Scientist",
        "ML Engineer",
        "Full Stack Developer",
        "Data Engineer",
      ],
      competencies: [
        "Python",
        "TensorFlow",
        "React",
        "D3.js",
        "Apache Spark",
        "Docker",
      ],
      capacity:
        "ML: 40h/week, Full Stack: 40h/week, Data Eng: 35h/week, Data Sci: 30h/week",
      location: "Remote / London Office",
      links: "https://confluence.example.com/ai-dashboard",
    },
  ];

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedProjects(projects.map((p) => p.id));
    } else {
      setSelectedProjects([]);
    }
  };

  const handleSelectProject = (id) => {
    setSelectedProjects((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Project Management</h1>
        <p className="text-gray-600 mt-1">
          Manage and track all active projects
        </p>
      </div>

      {selectedProjects.length > 0 && (
        <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 flex items-center justify-between">
          <span className="text-blue-800 font-medium">
            {selectedProjects.length} project(s) selected
          </span>
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            Bulk Actions
          </button>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    checked={selectedProjects.length === projects.length}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Project Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timeline
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Team Requirements
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location & Links
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {projects.map((project) => (
                <tr
                  key={project.id}
                  className={`hover:bg-gray-50 transition-colors ${
                    selectedProjects.includes(project.id) ? "bg-blue-50" : ""
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={selectedProjects.includes(project.id)}
                      onChange={() => handleSelectProject(project.id)}
                    />
                  </td>

                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      <h3 className="text-sm font-semibold text-gray-900">
                        {project.description}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {project.taskDescription}
                      </p>
                      <div className="mt-2">
                        <Stack
                          direction="row"
                          spacing={1}
                          flexWrap="wrap"
                          useFlexGap
                        >
                          {project.competencies.map((comp, idx) => (
                            <Chip
                              key={idx}
                              label={comp}
                              className="violet-chip"
                            />
                          ))}
                        </Stack>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-700">
                        <span className="font-medium">Start:</span>
                        <span className="ml-1">{project.startDate}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-700">
                        <span className="font-medium">End:</span>
                        <span className="ml-1">{project.endDate}</span>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="space-y-3">
                      <div className="flex items-center text-sm">
                        <span className="font-medium text-gray-700">
                          👥 {project.requiredEmployees} employees
                        </span>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-gray-500 uppercase">
                          Roles:
                        </p>
                        {project.roles.map((role, idx) => (
                          <span
                            key={idx}
                            className="inline-block mr-1 mb-1 px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {role}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-start text-sm text-gray-600">
                        <span className="text-xs">⏱️ {project.capacity}</span>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-700">
                        <span>📍 {project.location}</span>
                      </div>
                      <a
                        href={project.links}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        🔗 View Project
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
        <span>Showing {projects.length} projects</span>
        <div className="flex gap-2">
          <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">
            Previous
          </button>
          <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
