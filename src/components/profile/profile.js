import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Settings, ChevronDown } from "lucide-react";
import { toast } from "react-toastify";
import "./profile.css";

const getInitials = (name) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export default function UserProfile() {
  let employeeData = JSON.parse(localStorage.getItem("loginResponse") || "{}");
  const userName = employeeData.firstName + " " + employeeData.lastName;
  const userEmail = employeeData.email;
  const Position = employeeData.position;
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setIsOpen(false);
    if (window.confirm("Are you sure you want to log out?")) {
      console.log("Logging out and navigating to /");
      navigate("/");
      localStorage.clear();
      toast.success("You've been logged out", {
        autoClose: 2000,
        position: "top-right",
      });
    }
  };

  const handleSettingsClick = () => {
    if (employeeData) {
      if (employeeData.role === "EMPLOYEE") {
        navigate("/update-employee", {
          state: { employeeData, from: "employee" },
          replace: true,
        });
      } else if (employeeData.role === "DEPARTMENT_HEAD") {
        navigate("/update-employee", {
          state: { employeeData, from: "departmenthead" },
          replace: true,
        });
      } else if (employeeData.role === "PROJECT_MANAGER") {
        navigate("/update-employee", {
          state: { employeeData, from: "manager" },
          replace: true,
        });
      } else if (employeeData.role === "RESOURCE_PLANNER") {
        navigate("/update-employee", {
          state: { employeeData, from: "resourceplanner" },
          replace: true,
        });
      } else {
        navigate("/");
      }
    } else {
      console.error("No employee data in localStorage");
    }
  };

  return (
    <div className="user-profile-container" ref={dropdownRef}>
      <button
        className="user-profile-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="user-avatar">{getInitials(userName)}</div>

        <div className="user-info">
          <span className="user-name">{userName}</span>
          <span className="user-role">{Position}</span>
        </div>

        <ChevronDown
          className={`chevron-icon ${isOpen ? "chevron-open" : ""}`}
          size={20}
        />
      </button>

      {isOpen && (
        // The custom CSS animation is applied to this div
        <div className="user-profile-dropdown">
          <div className="dropdown-header">
            {/* <div className="dropdown-avatar">{getInitials(userName)}</div> */}
            <div className="dropdown-user-info">
              <p className="dropdown-user-name">{userName}</p>
              <p className="dropdown-user-email">{userEmail}</p>
              {/* <button className="dropdown-item" onClick={handleProfileClick}>
                <User size={20} />
                <span>My Profile</span>
              </button> */}
              <button className="dropdown-item" onClick={handleSettingsClick}>
                <Settings size={20} />
                <span>Settings</span>
              </button>
              <button
                className="dropdown-item dropdown-item-logout"
                onClick={handleLogout}
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
