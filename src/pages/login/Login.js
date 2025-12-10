import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../../components/inputfield/InputField";
import Button from "../../components/button/Button";
import "./Login.css";
import { toast } from "react-toastify";
import Roles from "../../constant/roles";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // const [Base_URL, setBase_URL] = useState("");
  const Base_URL = process.env.REACT_APP_BACKEND_BASE_URL;
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {

      let useMock = process.env.REACT_APP_USE_MOCK === "true";

      if (Base_URL.trim() == "") {
        useMock = true;
      }

      // Automatically choose mock or real API
      const api = useMock ? require("../../services/mock/apiMockLogin") : require("../../services/login/login_api");

      console.log("Using mock for login:", useMock);

      // API call to authenticate users
      const response = await api.login(username, password);

      console.log("Login response:", response);

      localStorage.setItem("loginResponse", JSON.stringify(response.data));

      if (response.status === 201 || response.status === 200) {
        toast.success(`Welcome back, ${response.data.firstName}! 👋`, {
          position: "top-right",
        });

        // Redirect based on role
        if (response.data.role === Roles.Project_Manager)
          navigate("/project_manager");
        else if (response.data.role === Roles.Employee) navigate("/employee_dashboard", { state: response.data });
        else if (response.data.role === Roles.System_Admin) navigate("/home");
        else navigate("/");
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError("Incorrect username or password");
        toast.error("Invalid username or password!");
      } else {
        setError("Unable to connect to the server. Please try again.");
        toast.error("Server not reachable. Please try again later ⚠️");
      }
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = username.trim() && password.trim();

  return (
    <div className="login-container">
      <h2>Workforce Management Tool </h2>
      <h2>Log In</h2>

      <form onSubmit={handleLogin} className="login-form">
        <InputField
          label="User Name"
          type="text"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
        />
        <InputField
          label="Password"
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
        />
        <Button
          type="submit"
          label={loading ? "Signing in..." : "Sign In"}
          disabled={!isFormValid || loading}
          loading={loading}
        />

        {loading && <div className="spinner"></div>}
        {error && <p className="error">{error}</p>}
      </form>
      {/* <p className="note">Demo users: sarah_pm/SecurePass123!</p> */}

      <p className="note">version: 1.7.12.10</p>
      <p className="note">
        Please ensure that the backend service is started before attempting to
        log in. For further assistance, kindly contact our team.
      </p>
    </div>
  );
};

export default Login;
