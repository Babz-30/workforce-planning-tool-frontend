import { useMemo, useState, useEffect } from "react";
import "./staffingTab.css";
import Pagination from "../pagination/Pagination";
import { buildProjectTeamTimeline } from "../../helper/staffingList";

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const options = { year: "numeric", month: "short", day: "numeric" };
  return date.toLocaleDateString("en-US", options);
};

// ------------------
// Filter and Sort Controls (same UI idea as proposeTab.js)
// ------------------
const FilterSortControls = ({
  searchTerm,
  setSearchTerm,
  sortBy,
  setSortBy,
}) => {
  return (
    <div
      className="filter-sort-controls"
      style={{
        display: "flex",
        gap: "1rem",
        marginBottom: "1.5rem",
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      <div className="search-box" style={{ flex: "1", minWidth: "250px" }}>
        <input
          type="text"
          placeholder="Search by project name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: "100%",
            padding: "0.5rem 1rem",
            border: "1px solid #ddd",
            borderRadius: "4px",
            fontSize: "0.95rem",
          }}
        />
      </div>

      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
        <label style={{ fontWeight: "500", fontSize: "0.9rem" }}>
          Sort by:
        </label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{
            padding: "0.5rem 1rem",
            border: "1px solid #ddd",
            borderRadius: "4px",
            fontSize: "0.95rem",
            cursor: "pointer",
          }}
        >
          <option value="name-asc">Name (A-Z)</option>
          <option value="name-desc">Name (Z-A)</option>
          <option value="date-asc">Start Date (Earliest)</option>
          <option value="date-desc">Start Date (Latest)</option>
          <option value="team-desc">Most Team Members</option>
          <option value="team-asc">Least Team Members</option>
        </select>
      </div>
    </div>
  );
};

export default function StaffingTab({
  projectJson,
  applicationByProjectId,
  employeeList,
}) {
  const [staffingPage, setStaffingPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // ✅ Search + Sort state (same pattern as proposeTab.js)
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name-asc");

  // ✅ Build timeline once (don’t call inside render repeatedly)
  const staffingData = useMemo(() => {
    return (
      buildProjectTeamTimeline({
        projectJson,
        applicationByProjectId,
        employeeList,
      }) || []
    );
  }, [projectJson, applicationByProjectId, employeeList]);

  // ✅ Filter + Sort (matches proposeTab.js approach)
  const filteredAndSorted = useMemo(() => {
    let filtered = staffingData.filter((r) =>
      (r?.description || "").toLowerCase().includes(searchTerm.toLowerCase()),
    );

    // add derived field for sorting
    const withCounts = filtered.map((r) => ({
      ...r,
      teamCount: Array.isArray(r.team) ? r.team.length : 0,
    }));

    const sorted = [...withCounts].sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return (a.description || "").localeCompare(b.description || "");
        case "name-desc":
          return (b.description || "").localeCompare(a.description || "");
        case "date-asc":
          return (
            new Date(a.start || "2100-01-01") -
            new Date(b.start || "2100-01-01")
          );
        case "date-desc":
          return (
            new Date(b.start || "1900-01-01") -
            new Date(a.start || "1900-01-01")
          );
        case "team-desc":
          return (b.teamCount || 0) - (a.teamCount || 0);
        case "team-asc":
          return (a.teamCount || 0) - (b.teamCount || 0);
        default:
          return 0;
      }
    });

    return sorted;
  }, [staffingData, searchTerm, sortBy]);

  // ✅ Reset to page 1 when search/sort results change
  useEffect(() => {
    setStaffingPage(1);
  }, [searchTerm, sortBy, filteredAndSorted.length]);

  // ✅ paginate slice
  const paginated = useMemo(() => {
    const startIndex = (staffingPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSorted.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredAndSorted, staffingPage]);

  return (
    <div className="content-card">
      <h2 className="section-title">Project Staffing Records</h2>
      <p className="section-description">Track who is assigned where</p>

      {/* ✅ same UI pattern as proposeTab.js */}
      <FilterSortControls
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      <div className="staffing-list">
        {paginated.map((record, idx) => (
          <div key={`${record.project}-${idx}`} className="staffing-card">
            <h3 className="staffing-project-name">{record.description}</h3>

            <div className="staffing-dates">
              <div className="date-item">
                <span className="date-label">Start Date</span>
                <p className="date-value">{formatDate(record.start)}</p>
              </div>
              <div className="date-item">
                <span className="date-label">End Date</span>
                <p className="date-value">{formatDate(record.end)}</p>
              </div>
            </div>

            <div className="team-section">
              <span className="team-label">Team Members</span>
              <div className="team-members">
                {(record.team || []).map((member) => (
                  <span key={member} className="team-member-badge">
                    {member}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ✅ IMPORTANT: totalItems must be filtered length (not 3) */}
      <Pagination
        currentPage={staffingPage}
        totalItems={filteredAndSorted.length}
        itemsPerPage={ITEMS_PER_PAGE}
        onPageChange={setStaffingPage}
      />
    </div>
  );
}
