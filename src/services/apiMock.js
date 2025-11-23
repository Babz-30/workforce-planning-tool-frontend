// Mock API for testing before backend is available
export const login = async (username, password) => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Define mock users
  const mockUsers = [
    { username: "user1", password: "pass@123" },
    { username: "user2", password: "pass@123" },
    { username: "user3", password: "pass@123" },
  ];

  const foundUser = mockUsers.find(
    (u) => u.username === username && u.password === password
  );

  if (foundUser) {
    return {
      status: 201,
      data: {
        managerId: "456",
        role: "PROJECT_MANAGER",
        username: foundUser.username,
      },
    };
  } else {
    const error = new Error("Invalid credentials");
    error.response = { status: 401 };
    throw error;
  }
};
