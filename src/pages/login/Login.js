import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../../components/inputfield/InputField";
import Button from "../../components/button/Button";
import "./Login.css";
import { toast } from "react-toastify";
import Roles from "../../constant/roles";

console.log("Using mock:", process.env.REACT_APP_USE_MOCK);

// Automatically choose mock or real API
const useMock = process.env.REACT_APP_USE_MOCK === "true";
const api = useMock
  ? require("../../services/mock/apiMockLogin")
  : require("../../services/login/login_api");

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // API call to authenticate users
      const response = await api.login(username, password);
      console.log("API returned:", response);

      // if (response.status === 201) {
      if (response.status === 200) {
        console.log("Logged in as:", response.data.username);
        toast.success(`Welcome back, ${response.data.firstName}! 👋`, {
          position: "top-right",
        });

        // Save for session
        localStorage.setItem("logindata", JSON.stringify(response));

        // Redirect based on role
        if (response.data.role === Roles.Project_Manager)
          navigate("/project_manager");
        else if (response.data.role === Roles.employee) navigate("/update-employee", { state: response.data });
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
      <h2>Login In</h2>
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
      <p className="note">Demo users: pm_john/pm123</p>
      <p className="note">version: 0.3</p>
    </div>
  );
};

export default Login;
