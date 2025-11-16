// projectsData.js

export const projectsList = [
  {
    id: 1,
    description: "E-commerce Platform Redesign",
    startDate: "2024-01-15",
    endDate: "2024-06-30",
    taskDescription:
      "Complete overhaul of the customer-facing e-commerce platform including UX research, wireframing, UI design, frontend development with React, backend API integration, payment gateway setup, and comprehensive testing across devices.",
    location: ["Remote", "New York Office"],
    links: "https://project-tracker.example.com/ecommerce",
    roles: [
      {
        requiredRole: "UI/UX Designer",
        requiredCompetencies: ["Figma", "UI/UX Design"],
        capacity: "30hrs/week",
        numberOfEmployees: "2",
        roleInput: "",
        competencyInput: "",
        showRoleDropdown: false,
        showCompetencyDropdown: false,
      },
      {
        requiredRole: "Frontend Developer",
        requiredCompetencies: ["React", "REST API"],
        capacity: "40hrs/week",
        numberOfEmployees: "2",
        roleInput: "",
        competencyInput: "",
        showRoleDropdown: false,
        showCompetencyDropdown: false,
      },
      {
        requiredRole: "Backend Developer",
        requiredCompetencies: [
          "Node.js",
          "PostgreSQL",
          "REST API",
          "Payment Integration",
        ],
        capacity: "35hrs/week",
        numberOfEmployees: "2",
        roleInput: "",
        competencyInput: "",
        showRoleDropdown: false,
        showCompetencyDropdown: false,
      },
      {
        requiredRole: "QA Engineer",
        requiredCompetencies: ["Testing"],
        capacity: "25hrs/week",
        numberOfEmployees: "2",
        roleInput: "",
        competencyInput: "",
        showRoleDropdown: false,
        showCompetencyDropdown: false,
      },
    ],
    selectedSkills: [
      "React",
      "Node.js",
      "PostgreSQL",
      "Figma",
      "REST API",
      "Payment Integration",
    ],
  },
  {
    id: 2,
    description: "Mobile App Development - Healthcare",
    startDate: "2024-02-01",
    endDate: "2024-08-15",
    taskDescription:
      "Develop a cross-platform mobile application for patient appointment scheduling, telemedicine consultations, prescription management, and health record access. Includes HIPAA compliance implementation and security audits.",
    location: ["Hybrid", "San Francisco"],
    links: "https://jira.example.com/healthcare-app",
    roles: [
      {
        requiredRole: "Mobile Developer",
        requiredCompetencies: ["React Native", "Mobile Security"],
        capacity: "40hrs/week",
        numberOfEmployees: "2",
        roleInput: "",
        competencyInput: "",
        showRoleDropdown: false,
        showCompetencyDropdown: false,
      },
      {
        requiredRole: "Backend Developer",
        requiredCompetencies: ["AWS", "HIPAA Compliance"],
        capacity: "35hrs/week",
        numberOfEmployees: "2",
        roleInput: "",
        competencyInput: "",
        showRoleDropdown: false,
        showCompetencyDropdown: false,
      },
      {
        requiredRole: "DevOps Engineer",
        requiredCompetencies: ["AWS", "CI/CD"],
        capacity: "20hrs/week",
        numberOfEmployees: "1",
        roleInput: "",
        competencyInput: "",
        showRoleDropdown: false,
        showCompetencyDropdown: false,
      },
      {
        requiredRole: "Security Specialist",
        requiredCompetencies: ["HIPAA Compliance", "Mobile Security"],
        capacity: "15hrs/week",
        numberOfEmployees: "1",
        roleInput: "",
        competencyInput: "",
        showRoleDropdown: false,
        showCompetencyDropdown: false,
      },
    ],
    selectedSkills: [
      "React Native",
      "AWS",
      "HIPAA Compliance",
      "Mobile Security",
      "CI/CD",
    ],
  },
  {
    id: 3,
    description: "AI-Powered Analytics Dashboard",
    startDate: "2024-03-10",
    endDate: "2024-09-30",
    taskDescription:
      "Build an intelligent analytics dashboard that uses machine learning to provide predictive insights, automated reporting, data visualization, and real-time monitoring. Integration with multiple data sources and custom ML model training.",
    location: ["Remote", "London Office"],
    links: "https://confluence.example.com/ai-dashboard",
    roles: [
      {
        requiredRole: "Data Scientist",
        requiredCompetencies: ["Python", "TensorFlow", "Machine Learning"],
        capacity: "30hrs/week",
        numberOfEmployees: "3",
        roleInput: "",
        competencyInput: "",
        showRoleDropdown: false,
        showCompetencyDropdown: false,
      },
      {
        requiredRole: "ML Engineer",
        requiredCompetencies: ["Python", "TensorFlow", "Docker"],
        capacity: "40hrs/week",
        numberOfEmployees: "2",
        roleInput: "",
        competencyInput: "",
        showRoleDropdown: false,
        showCompetencyDropdown: false,
      },
      {
        requiredRole: "Full Stack Developer",
        requiredCompetencies: ["React", "D3.js", "Python"],
        capacity: "40hrs/week",
        numberOfEmployees: "3",
        roleInput: "",
        competencyInput: "",
        showRoleDropdown: false,
        showCompetencyDropdown: false,
      },
      {
        requiredRole: "Data Engineer",
        requiredCompetencies: ["Python", "Apache Spark", "Docker"],
        capacity: "35hrs/week",
        numberOfEmployees: "2",
        roleInput: "",
        competencyInput: "",
        showRoleDropdown: false,
        showCompetencyDropdown: false,
      },
    ],
    selectedSkills: [
      "Python",
      "TensorFlow",
      "React",
      "D3.js",
      "Apache Spark",
      "Docker",
    ],
  },
  {
    id: 4,
    description: "Blockchain Integration Platform",
    startDate: "2024-04-01",
    endDate: "2024-10-15",
    taskDescription:
      "Develop a secure blockchain-based platform for supply chain tracking, smart contract management, and cryptocurrency payment processing with full audit trail capabilities.",
    location: ["Remote", "Singapore Office"],
    links: "https://gitlab.example.com/blockchain-platform",
    roles: [
      {
        requiredRole: "Blockchain Developer",
        requiredCompetencies: ["Solidity", "Ethereum", "Web3.js"],
        capacity: "40hrs/week",
        numberOfEmployees: "2",
        roleInput: "",
        competencyInput: "",
        showRoleDropdown: false,
        showCompetencyDropdown: false,
      },
      {
        requiredRole: "Smart Contract Engineer",
        requiredCompetencies: ["Solidity", "Ethereum"],
        capacity: "40hrs/week",
        numberOfEmployees: "2",
        roleInput: "",
        competencyInput: "",
        showRoleDropdown: false,
        showCompetencyDropdown: false,
      },
      {
        requiredRole: "Security Specialist",
        requiredCompetencies: ["Cryptography", "Security"],
        capacity: "30hrs/week",
        numberOfEmployees: "1",
        roleInput: "",
        competencyInput: "",
        showRoleDropdown: false,
        showCompetencyDropdown: false,
      },
      {
        requiredRole: "Backend Developer",
        requiredCompetencies: ["Node.js", "Web3.js"],
        capacity: "35hrs/week",
        numberOfEmployees: "2",
        roleInput: "",
        competencyInput: "",
        showRoleDropdown: false,
        showCompetencyDropdown: false,
      },
    ],
    selectedSkills: [
      "Solidity",
      "Ethereum",
      "Web3.js",
      "Node.js",
      "Cryptography",
    ],
  },
  {
    id: 5,
    description: "Cloud Migration & Optimization",
    startDate: "2024-05-01",
    endDate: "2024-11-30",
    taskDescription:
      "Migrate legacy systems to cloud infrastructure, implement auto-scaling, disaster recovery, cost optimization, and infrastructure as code practices.",
    location: ["Remote", "Seattle Office"],
    links: "https://jira.example.com/cloud-migration",
    roles: [
      {
        requiredRole: "DevOps Engineer",
        requiredCompetencies: [
          "AWS",
          "Kubernetes",
          "Docker",
          "Jenkins",
          "Monitoring",
        ],
        capacity: "40hrs/week",
        numberOfEmployees: "2",
        roleInput: "",
        competencyInput: "",
        showRoleDropdown: false,
        showCompetencyDropdown: false,
      },
      {
        requiredRole: "Cloud Architect",
        requiredCompetencies: ["AWS", "Terraform", "Kubernetes"],
        capacity: "30hrs/week",
        numberOfEmployees: "1",
        roleInput: "",
        competencyInput: "",
        showRoleDropdown: false,
        showCompetencyDropdown: false,
      },
      {
        requiredRole: "Backend Developer",
        requiredCompetencies: ["AWS", "Docker"],
        capacity: "35hrs/week",
        numberOfEmployees: "1",
        roleInput: "",
        competencyInput: "",
        showRoleDropdown: false,
        showCompetencyDropdown: false,
      },
      {
        requiredRole: "QA Engineer",
        requiredCompetencies: ["Testing", "Monitoring"],
        capacity: "35hrs/week",
        numberOfEmployees: "1",
        roleInput: "",
        competencyInput: "",
        showRoleDropdown: false,
        showCompetencyDropdown: false,
      },
    ],
    selectedSkills: [
      "AWS",
      "Kubernetes",
      "Terraform",
      "Docker",
      "Jenkins",
      "Monitoring",
    ],
  },
  {
    id: 6,
    description: "IoT Smart Home Platform",
    startDate: "2024-06-15",
    endDate: "2024-12-31",
    taskDescription:
      "Create an IoT platform for smart home device integration, real-time monitoring, automation rules, voice assistant integration, and mobile app controls.",
    location: ["Hybrid", "Austin Office"],
    links: "https://project-hub.example.com/iot-platform",
    roles: [
      {
        requiredRole: "IoT Developer",
        requiredCompetencies: ["MQTT", "Python", "AWS IoT"],
        capacity: "40hrs/week",
        numberOfEmployees: "3",
        roleInput: "",
        competencyInput: "",
        showRoleDropdown: false,
        showCompetencyDropdown: false,
      },
      {
        requiredRole: "Embedded Systems Engineer",
        requiredCompetencies: ["Embedded C", "Bluetooth", "MQTT"],
        capacity: "30hrs/week",
        numberOfEmployees: "2",
        roleInput: "",
        competencyInput: "",
        showRoleDropdown: false,
        showCompetencyDropdown: false,
      },
      {
        requiredRole: "Mobile Developer",
        requiredCompetencies: ["React Native"],
        capacity: "35hrs/week",
        numberOfEmployees: "2",
        roleInput: "",
        competencyInput: "",
        showRoleDropdown: false,
        showCompetencyDropdown: false,
      },
      {
        requiredRole: "Backend Developer",
        requiredCompetencies: ["Python", "AWS IoT"],
        capacity: "35hrs/week",
        numberOfEmployees: "2",
        roleInput: "",
        competencyInput: "",
        showRoleDropdown: false,
        showCompetencyDropdown: false,
      },
    ],
    selectedSkills: [
      "MQTT",
      "Python",
      "React Native",
      "AWS IoT",
      "Embedded C",
      "Bluetooth",
    ],
  },
  {
    id: 7,
    description: "Customer Data Platform (CDP)",
    startDate: "2024-07-01",
    endDate: "2025-01-31",
    taskDescription:
      "Build a unified customer data platform that aggregates data from multiple sources, provides real-time segmentation, predictive analytics, and personalization capabilities.",
    location: ["Remote", "Boston Office"],
    links: "https://confluence.example.com/cdp-project",
    roles: [
      {
        requiredRole: "Data Engineer",
        requiredCompetencies: [
          "Apache Kafka",
          "Elasticsearch",
          "Python",
          "SQL",
        ],
        capacity: "40hrs/week",
        numberOfEmployees: "3",
        roleInput: "",
        competencyInput: "",
        showRoleDropdown: false,
        showCompetencyDropdown: false,
      },
      {
        requiredRole: "Backend Developer",
        requiredCompetencies: ["Python", "SQL", "Apache Kafka"],
        capacity: "40hrs/week",
        numberOfEmployees: "3",
        roleInput: "",
        competencyInput: "",
        showRoleDropdown: false,
        showCompetencyDropdown: false,
      },
      {
        requiredRole: "Data Scientist",
        requiredCompetencies: ["Python", "Machine Learning", "SQL"],
        capacity: "35hrs/week",
        numberOfEmployees: "3",
        roleInput: "",
        competencyInput: "",
        showRoleDropdown: false,
        showCompetencyDropdown: false,
      },
      {
        requiredRole: "Frontend Developer",
        requiredCompetencies: ["React"],
        capacity: "30hrs/week",
        numberOfEmployees: "3",
        roleInput: "",
        competencyInput: "",
        showRoleDropdown: false,
        showCompetencyDropdown: false,
      },
    ],
    selectedSkills: [
      "Apache Kafka",
      "Elasticsearch",
      "Python",
      "React",
      "SQL",
      "Machine Learning",
    ],
  },
  {
    id: 8,
    description: "Video Streaming Platform",
    startDate: "2024-08-01",
    endDate: "2025-02-28",
    taskDescription:
      "Develop a scalable video streaming platform with live streaming capabilities, content delivery network integration, adaptive bitrate streaming, and social features.",
    location: ["Hybrid", "Los Angeles Office"],
    links: "https://github.example.com/video-streaming",
    roles: [
      {
        requiredRole: "Video Engineer",
        requiredCompetencies: ["FFmpeg", "WebRTC", "CDN", "AWS Media Services"],
        capacity: "40hrs/week",
        numberOfEmployees: "3",
        roleInput: "",
        competencyInput: "",
        showRoleDropdown: false,
        showCompetencyDropdown: false,
      },
      {
        requiredRole: "Backend Developer",
        requiredCompetencies: ["Node.js", "AWS Media Services"],
        capacity: "40hrs/week",
        numberOfEmployees: "3",
        roleInput: "",
        competencyInput: "",
        showRoleDropdown: false,
        showCompetencyDropdown: false,
      },
      {
        requiredRole: "Frontend Developer",
        requiredCompetencies: ["React", "WebRTC"],
        capacity: "35hrs/week",
        numberOfEmployees: "3",
        roleInput: "",
        competencyInput: "",
        showRoleDropdown: false,
        showCompetencyDropdown: false,
      },
      {
        requiredRole: "DevOps Engineer",
        requiredCompetencies: ["AWS Media Services", "CDN"],
        capacity: "25hrs/week",
        numberOfEmployees: "2",
        roleInput: "",
        competencyInput: "",
        showRoleDropdown: false,
        showCompetencyDropdown: false,
      },
    ],
    selectedSkills: [
      "FFmpeg",
      "WebRTC",
      "CDN",
      "React",
      "Node.js",
      "AWS Media Services",
    ],
  },
];

export default function getProjectById(id) {
  console.log("Fetching project with ID:", id);
  return projectsList.find((project) => project.id === id);
}

export function convertProjectsList() {
  return projectsList.map((project) => {
    // Calculate total required employees
    const requiredEmployees = project.roles.reduce((total, role) => {
      return total + parseInt(role.numberOfEmployees || 0);
    }, 0);

    // Extract unique roles (filter out undefined/null values)
    const roles = project.roles
      .map((role) => role.requiredRole)
      .filter((role) => role); // Remove undefined/null

    // Extract unique competencies (flatten and deduplicate)
    const competencies = [
      ...new Set(project.roles.flatMap((role) => project.selectedSkills || [])),
    ];

    // Build capacity string
    const capacity = project.roles
      .filter((role) => role.requiredRole && role.capacity) // Only include roles with both fields
      .map((role) => {
        // Shorten role name (take first word)
        const shortName = role.requiredRole.split(" ")[0];
        return `${shortName}: ${role.capacity}`;
      })
      .join(", ");

    // Convert location array to string
    const location = Array.isArray(project.location)
      ? project.location.join(" / ")
      : project.location || "";

    // Return transformed project object
    return {
      id: project.id,
      description: project.description,
      startDate: project.startDate,
      endDate: project.endDate,
      taskDescription: project.taskDescription,
      requiredEmployees,
      roles,
      competencies,
      capacity,
      location,
      links: project.links,
    };
  });
}
