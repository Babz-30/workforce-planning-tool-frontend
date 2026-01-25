import { useState } from "react";
import "./staffingTab.css";
import Pagination from "../pagination/Pagination"; // Import the pagination component
import { buildProjectTeamTimeline } from "../../helper/staffingList";
// import projectJson from "../../pages/resource_planner/project.json";
// import applicationByProjectId from "../../pages/resource_planner/employee.json";
// import employeeList from "../../pages/resource_planner/employeeList.json";

export default function StaffingTab({
  projectJson,
  applicationByProjectId,
  employeeList,
}) {
  console.log("StaffingTab props:", {
    projectJson,
    applicationByProjectId,
    employeeList,
  });
  const [staffingPage, setStaffingPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  console.log(
    buildProjectTeamTimeline({
      projectJson,
      applicationByProjectId,
      employeeList,
    }),
  );

  const paginateItems = (items, currentPage) => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return items.slice(startIndex, endIndex);
  };
  return (
    <div className="content-card">
      <h2 className="section-title">Project Staffing Records</h2>
      <p className="section-description">Track who is assigned where</p>

      <div className="staffing-list">
        {paginateItems(
          //   [
          //     {
          //       project: "Project Alpha",
          //       team: ["Sarah Chen", "Emma Thompson"],
          //       start: "2025-10-01",
          //       end: "2025-12-31",
          //     },
          //     {
          //       project: "Project Beta",
          //       team: ["Maria Garcia"],
          //       start: "2025-11-01",
          //       end: "2026-01-31",
          //     },
          //     {
          //       project: "Project Gamma",
          //       team: ["Emma Thompson"],
          //       start: "2025-11-15",
          //       end: "2026-02-15",
          //     },
          //   ]
          buildProjectTeamTimeline({
            projectJson,
            applicationByProjectId,
            employeeList,
          }), // Replace with actual data source
          staffingPage,
        ).map((record, idx) => (
          <div key={idx} className="staffing-card">
            <h3 className="staffing-project-name">{record.description}</h3>
            <div className="staffing-dates">
              <div className="date-item">
                <span className="date-label">Start Date</span>
                <p className="date-value">{record.start}</p>
              </div>
              <div className="date-item">
                <span className="date-label">End Date</span>
                <p className="date-value">{record.end}</p>
              </div>
            </div>
            <div className="team-section">
              <span className="team-label">Team Members</span>
              <div className="team-members">
                {record.team.map((member) => (
                  <span key={member} className="team-member-badge">
                    {member}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      <Pagination
        currentPage={staffingPage}
        totalItems={3}
        itemsPerPage={ITEMS_PER_PAGE}
        onPageChange={setStaffingPage}
      />
    </div>
  );
}
