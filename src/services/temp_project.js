// projectsData.js

export const projectsList = [
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
  {
    id: 4,
    description: "Blockchain Integration Platform",
    startDate: "2024-04-01",
    endDate: "2024-10-15",
    taskDescription:
      "Develop a secure blockchain-based platform for supply chain tracking, smart contract management, and cryptocurrency payment processing with full audit trail capabilities.",
    requiredEmployees: 7,
    roles: [
      "Blockchain Developer",
      "Smart Contract Engineer",
      "Security Specialist",
      "Backend Developer",
    ],
    competencies: [
      "Solidity",
      "Ethereum",
      "Web3.js",
      "Node.js",
      "Cryptography",
    ],
    capacity: "Blockchain: 40h/week, Backend: 35h/week, Security: 30h/week",
    location: "Remote / Singapore Office",
    links: "https://gitlab.example.com/blockchain-platform",
  },
  {
    id: 5,
    description: "Cloud Migration & Optimization",
    startDate: "2024-05-01",
    endDate: "2024-11-30",
    taskDescription:
      "Migrate legacy systems to cloud infrastructure, implement auto-scaling, disaster recovery, cost optimization, and infrastructure as code practices.",
    requiredEmployees: 5,
    roles: [
      "DevOps Engineer",
      "Cloud Architect",
      "Backend Developer",
      "QA Engineer",
    ],
    competencies: [
      "AWS",
      "Kubernetes",
      "Terraform",
      "Docker",
      "Jenkins",
      "Monitoring",
    ],
    capacity: "DevOps: 40h/week, Cloud Arch: 30h/week, Backend: 35h/week",
    location: "Remote / Seattle Office",
    links: "https://jira.example.com/cloud-migration",
  },
  {
    id: 6,
    description: "IoT Smart Home Platform",
    startDate: "2024-06-15",
    endDate: "2024-12-31",
    taskDescription:
      "Create an IoT platform for smart home device integration, real-time monitoring, automation rules, voice assistant integration, and mobile app controls.",
    requiredEmployees: 9,
    roles: [
      "IoT Developer",
      "Embedded Systems Engineer",
      "Mobile Developer",
      "Backend Developer",
    ],
    competencies: [
      "MQTT",
      "Python",
      "React Native",
      "AWS IoT",
      "Embedded C",
      "Bluetooth",
    ],
    capacity:
      "IoT: 40h/week, Mobile: 35h/week, Backend: 35h/week, Embedded: 30h/week",
    location: "Hybrid - Austin Office",
    links: "https://project-hub.example.com/iot-platform",
  },
  {
    id: 7,
    description: "Customer Data Platform (CDP)",
    startDate: "2024-07-01",
    endDate: "2025-01-31",
    taskDescription:
      "Build a unified customer data platform that aggregates data from multiple sources, provides real-time segmentation, predictive analytics, and personalization capabilities.",
    requiredEmployees: 12,
    roles: [
      "Data Engineer",
      "Backend Developer",
      "Data Scientist",
      "Frontend Developer",
    ],
    competencies: [
      "Apache Kafka",
      "Elasticsearch",
      "Python",
      "React",
      "SQL",
      "Machine Learning",
    ],
    capacity:
      "Data Eng: 40h/week, Backend: 40h/week, Data Sci: 35h/week, Frontend: 30h/week",
    location: "Remote / Boston Office",
    links: "https://confluence.example.com/cdp-project",
  },
  {
    id: 8,
    description: "Video Streaming Platform",
    startDate: "2024-08-01",
    endDate: "2025-02-28",
    taskDescription:
      "Develop a scalable video streaming platform with live streaming capabilities, content delivery network integration, adaptive bitrate streaming, and social features.",
    requiredEmployees: 11,
    roles: [
      "Video Engineer",
      "Backend Developer",
      "Frontend Developer",
      "DevOps Engineer",
    ],
    competencies: [
      "FFmpeg",
      "WebRTC",
      "CDN",
      "React",
      "Node.js",
      "AWS Media Services",
    ],
    capacity:
      "Video Eng: 40h/week, Backend: 40h/week, Frontend: 35h/week, DevOps: 25h/week",
    location: "Hybrid - Los Angeles Office",
    links: "https://github.example.com/video-streaming",
  },
];
export default function getProjectById(id) {
  console.log("Fetching project with ID:", id);
  return projectsList.find((project) => project.id === id);
}
