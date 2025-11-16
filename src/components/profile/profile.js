import React from "react";
import { useNavigate } from "react-router-dom";
import "./profile.css";

export default function UserProfile() {
  const navigate = useNavigate();
  const handleLogout = () => {
    alert("Are you sure to Logg out");
    navigate("/");
  };

  return (
    <div className="d-flex align-items-center gap-3">
      <div className="dropdown">
        <button
          className="profile-btn"
          type="button"
          id="profileDropdownMenuButton"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </button>

        <ul
          className="dropdown-menu dropdown-menu-end"
          aria-labelledby="profileDropdownMenuButton"
        >
          <li>
            <button
              className="dropdown-item"
              onClick={handleLogout}
              style={{ color: "red" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              Logout
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}
