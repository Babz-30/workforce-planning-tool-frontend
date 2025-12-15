// Mock API for testing before backend is available
export const login = async (username, password) => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Define mock users with full response data
    const mockUsers = [
        {
            username: "emp_emma",
            password: "emp123",
            data: {
                "_id": { "$oid": "6910fe3647a984367dd713e0" },
                "username": "emp_emma",
                "firstName": "Emma",
                "lastName": "Wilson",
                "email": "emma.wilson@workforce.com",
                "department": "IT",
                "position": "Software Engineer",
                "role": "EMPLOYEE",
                "userId": "071de1d6-ed1a-4e1a-a7bb-ad6d0f2cd161",
                "employeeId": "8"
            }
        },
        {
            username: "pm_sarah",
            password: "pm123",
            data: {
                "_id": { "$oid": "6910fe3647a984367dd713e9" },
                "username": "pm_sarah",
                "firstName": "Sarah",
                "lastName": "Johnson",
                "email": "sarah.johnson@workforce.com",
                "department": "Management",
                "position": "Project Manager",
                "role": "PROJECT_MANAGER",
                "userId": "92fa4f0b-aabc-4781-XYZ-848d10bbb222",
                "employeeId": "987456123"
            }
        },
        {
            username: "admin_john",
            password: "admin123",
            data: {
                "_id": { "$oid": "6910fe3647a984367dd713f2" },
                "username": "admin_john",
                "firstName": "John",
                "lastName": "Adams",
                "email": "john.adams@workforce.com",
                "department": "Admin",
                "position": "Administrator",
                "role": "ADMIN",
                "userId": "d9da4f0b-0000-1111-2222-adminuser123",
                "employeeId": "48648486"
            }
        }
    ];

    // Match user
    const foundUser = mockUsers.find(
        (u) => u.username === username && u.password === password
    );

    if (foundUser) {
        return {
            status: 200,
            data: foundUser.data
        };
    }

    // Throw error if invalid
    const error = new Error("Invalid credentials");
    error.response = { status: 401 };
    throw error;
};
