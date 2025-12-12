// import React from "react";
// import { useNavigate } from "react-router-dom";
// import "./profile.css";

// export default function UserProfile() {
//   const navigate = useNavigate();
//   const handleLogout = () => {
//     alert("Are you sure to Logg out");
//     navigate("/");
//   };

//   return (
//     <div className="d-flex align-items-center gap-3">
//       <div className="dropdown">
//         <button
//           className="profile-btn"
//           type="button"
//           id="profileDropdownMenuButton"
//           data-bs-toggle="dropdown"
//           aria-expanded="false"
//         >
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             width="20"
//             height="20"
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="2"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//           >
//             <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
//             <circle cx="12" cy="7" r="4"></circle>
//           </svg>
//         </button>

//         <ul
//           className="dropdown-menu dropdown-menu-end"
//           aria-labelledby="profileDropdownMenuButton"
//         >
//           <li>
//             <button
//               className="dropdown-item"
//               onClick={handleLogout}
//               style={{ color: "red" }}
//             >
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 width="16"
//                 height="16"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               >
//                 <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
//                 <polyline points="16 17 21 12 16 7"></polyline>
//                 <line x1="21" y1="12" x2="9" y2="12"></line>
//               </svg>
//               Logout
//             </button>
//           </li>
//         </ul>
//       </div>
//     </div>
//   );
// }

import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Settings, User, ChevronDown } from "lucide-react";
import "./profile.css";

const getInitials = (name) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export default function UserProfile({
  userName = "John Doe",
  userEmail = "john.doe@company.com",
}) {
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
      // Add your actual logout logic here (e.g., clearing tokens)
      console.log("Logging out and navigating to /");
      navigate("/");
    }
  };

  const handleSettingsClick = () => {
    setIsOpen(false);
    console.log("Navigating to /settings");
    navigate("/settings");
  };

  const handleProfileClick = () => {
    setIsOpen(false);
    console.log("Navigating to /profile");
    navigate("/profile");
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
          <span className="user-role">Manager</span>
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
              <button className="dropdown-item" onClick={handleProfileClick}>
                <User size={20} />
                <span>My Profile</span>
              </button>
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
          <div className="dropdown-divider"></div>
        </div>
      )}
    </div>
  );
}
