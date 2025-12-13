// mockEmployeeApi.js

// ------------------------------
// ⭐ Mock Employee Database
// ------------------------------
const mockEmployees = {
    // EMPLOYEE → Alice
    "10": {
        "employeeId": "10",
        "userId": "d9da4f0b-fefb-4781-b271-848d104asf231",
        firstName: "Emma",
        lastName: "Wilson",
        "username": "emp_emma",
        id: "Emp-001",
        position: "Software Engineer",
        department: "IT",
        supervisor: "Babitha Nadar",
        assignedProjectId: "PRJ-CMK843",
        email: "emma.wilson@workforce.com",
        emergencyContact: "+4915123456789",
        primaryLocation: "Frankfurt",
        selectedSkills: ["React", "Node.js", "MongoDB"],
        selectedInterests: ["UI/UX Design", "Cloud Computing","Database Management"],
        status: "AVAILABLE",
        contractType: "FULL_TIME",
        contractStartDate: "2024-05-01",
        contractEndDate: "2027-05-01",
        capacity: "40",
        experiences: [
            {
                role: "Junior Engineer",
                company: "SoftTech",
                startDate: "2024-05-01",
                endDate: "2024-05-01",
                description: "Worked in frontend team delivering key UI modules."
            }
        ],
    },

    "50015": {
        "employeeId": "50015",
        "userId": "d9da4f0b-fefb-4781-b271-848d104e6231",
        firstName: "David",
        lastName: "Martinez",
        "username": "david_dev",
        id: "Emp-001",
        position: "Software Engineer",
        department: "IT",
        email: "david.williams@workforce.com",
        emergencyContact: "+4915123456789",
        primaryLocation: "Frankfurt",
        selectedSkills: ["React", "Node.js", "MongoDB"],
        selectedInterests: ["Cloud", "Microservices"],
        status: "AVAILABLE",
        contractType: "FULL_TIME",
        contractStartDate: "2024-05-01",
        contractEndDate: "2027-05-01",
        capacity: "40",
        experiences: [
            {
                role: "Junior Engineer",
                company: "SoftTech",
                startDate: "2024-05-01",
                endDate: "2024-05-01",
                description: "Worked in frontend team delivering key UI modules."
            }
        ],
    },

    // PROJECT MANAGER → Sarah
    "987456123": {
        "employeeId": "987456123",
        "userId": "d9da4f0b-fefb-4781-b271-848d104asf222",
        firstName: "Sarah",
        lastName: "Connor",
        id: "PM-101",
        position: "Project Manager",
        department: "Engineering",
        email: "sarah.connor@workforce.com",
        emergencyContact: "+4915554850123",
        primaryLocation: "Frankfurt",
        selectedSkills: ["JavaScript", "React", "Node.js"],
        selectedInterests: ["Project Management", "Web Development"],
        status: "AVAILABLE",
        contractType: "PART_TIME",
        contractStartDate: "2025-10-30",
        contractEndDate: "2026-10-30",
        capacity: "20",
        experiences: [
            {
                role: "Senior Software Engineer",
                company: "Tech Corp",
                startDate: "2024-05-01",
                endDate: "2024-05-01",
                description: "Led cross-functional teams in delivering complex software projects"
            }
        ]
    },

    // ADMIN → John
    "48648486": {
        "employeeId": "48648486",
        "userId": "d9da4f0b-fefb-4781-b271-8465as104asf231",
        firstName: "John",
        lastName: "Adams",
        id: "Adm-500",
        position: "Administrator",
        department: "Admin",
        email: "john.adams@workforce.com",
        emergencyContact: "+491555000111",
        primaryLocation: "Berlin",
        selectedSkills: ["Leadership", "Documentation"],
        selectedInterests: ["Compliance", "Auditing"],
        status: "AVAILABLE",
        contractType: "FULL_TIME",
        contractStartDate: "2023-01-01",
        contractEndDate: "2028-01-01",
        capacity: "40",
        experiences: [
            {
                role: "Admin Assistant",
                company: "CorpX",
                startDate: "2024-05-01",
                endDate: "2024-05-01",
                description: "Managed internal workflows and HR documentation."
            }
        ]
    }
};

// ------------------------------
// ⭐ MOCK GET /api/employees/{employeeId}
// ------------------------------
export const getEmployeeById = async (employeeId) => {
    await new Promise((resolve) => setTimeout(resolve, 600)); // Simulated delay

    if (!mockEmployees[employeeId]) {
        const error = new Error("Employee not found");
        error.response = { status: 404 };
        throw error;
    }

    return {
        status: 200,
        data: mockEmployees[employeeId]
    };
};

// ------------------------------
// ⭐ MOCK PUT /api/employees/{employeeId}
// ------------------------------
export const updateEmployeeById = async (employeeId, updates) => {
    await new Promise((resolve) => setTimeout(resolve, 600)); // Simulated delay

    if (!mockEmployees[employeeId]) {
        const error = new Error("Employee not found");
        error.response = { status: 404 };
        throw error;
    }

    // Merge updates into mock DB
    mockEmployees[employeeId] = {
        ...mockEmployees[employeeId],
        ...updates,
        updatedAt: new Date().toISOString()
    };

    return {
        status: 200,
        message: "Employee updated successfully",
        data: mockEmployees[employeeId]
    };
};
