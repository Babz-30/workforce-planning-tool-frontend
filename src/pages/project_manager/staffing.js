import { useState } from "react";

export default function Staffing() {
  const [activeTab, setActiveTab] = useState("home");

  // Dummy data for Staffing
  const staffingData = [
    { id: 1, name: "Alice Johnson", role: "Developer", status: "Active" },
    { id: 2, name: "Bob Smith", role: "Designer", status: "Inactive" },
    { id: 3, name: "Charlie Brown", role: "Project Manager", status: "Active" },
  ];

  return (
    <div className="container mt-4">
      <ul className="nav nav-tabs gap-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "home" ? "active" : ""}`}
            onClick={() => setActiveTab("home")}
          >
            Home
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "staffing" ? "active" : ""}`}
            onClick={() => setActiveTab("staffing")}
          >
            Staffing
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "approvals" ? "active" : ""}`}
            onClick={() => setActiveTab("approvals")}
          >
            Approvals
          </button>
        </li>
        <li className="nav-item">
          <button className="nav-link disabled" disabled>
            Disabled
          </button>
        </li>
      </ul>

      <div className="tab-content mt-3">
        {/* Home does nothing */}
        {activeTab === "staffing" && (
          <div>
            <h4>Staffing Table</h4>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {staffingData.map((staff) => (
                  <tr key={staff.id}>
                    <td>{staff.id}</td>
                    <td>{staff.name}</td>
                    <td>{staff.role}</td>
                    <td>{staff.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "approvals" && <div>Approvals Content</div>}
      </div>
    </div>
  );
}
