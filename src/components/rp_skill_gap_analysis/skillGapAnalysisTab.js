import { useState } from "react";
import { TrendingUp } from "lucide-react";
import "./skillGapAnalysisTab.css";

const SkillGapAnalysis = ({ skillGaps }) => {
  const [sortConfig, setSortConfig] = useState({
    key: "gap",
    direction: "desc",
  });
  const [searchTerm, setSearchTerm] = useState("");

  const sortData = (data, key, direction) => {
    return [...data].sort((a, b) => {
      let aVal = a[key];
      let bVal = b[key];

      if (key === "skill") {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (aVal < bVal) return direction === "asc" ? -1 : 1;
      if (aVal > bVal) return direction === "asc" ? 1 : -1;
      return 0;
    });
  };

  const handleSort = (e) => {
    const value = e.target.value;
    const [key, direction] = value.split("-");
    setSortConfig({ key, direction });
  };

  const filterData = (data) => {
    if (!searchTerm) return data;
    return data.filter((gap) =>
      gap.skill.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const filteredGaps = filterData(skillGaps);
  const sortedGaps = sortData(
    filteredGaps,
    sortConfig.key,
    sortConfig.direction
  );

  return (
    <div className="content-card">
      <h2 className="section-title">Skill Gap Analysis</h2>
      <p className="section-description">
        Identify missing skill sets across the organization
      </p>

      {/* Search and Sort Controls */}
      <div className="skill-gap-controls">
        <div className="search-container">
          {/* <Search className="search-icon" /> */}
          <input
            type="text"
            placeholder="Search skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="sort-container">
          <label htmlFor="sort-select" className="sort-label">
            Sort by:
          </label>
          <select
            id="sort-select"
            value={`${sortConfig.key}-${sortConfig.direction}`}
            onChange={handleSort}
            className="sort-select"
          >
            <option value="gap-desc">Gap (High to Low)</option>
            <option value="gap-asc">Gap (Low to High)</option>
            <option value="skill-asc">Skill (A to Z)</option>
            <option value="skill-desc">Skill (Z to A)</option>
            <option value="required-desc">Required (High to Low)</option>
            <option value="required-asc">Required (Low to High)</option>
            <option value="available-desc">Available (High to Low)</option>
            <option value="available-asc">Available (Low to High)</option>
          </select>
        </div>
      </div>

      {/* Results Count */}
      {searchTerm && (
        <div className="results-count">
          Showing {sortedGaps.length} of {skillGaps.length} skills
        </div>
      )}

      <div className="gap-list">
        {sortedGaps.length === 0 ? (
          <div className="no-results">
            No skills found matching "{searchTerm}"
          </div>
        ) : (
          sortedGaps.map((gap) => (
            <div key={gap.skill} className="gap-card">
              <div className="gap-header">
                <h3 className="gap-skill-name">{gap.skill}</h3>
                <span
                  className={`gap-badge gap-${
                    gap.gap > 3 ? "high" : gap.gap > 1 ? "medium" : "low"
                  }`}
                >
                  Gap: {gap.gap}
                </span>
              </div>
              <div className="gap-stats">
                <div className="gap-stat">
                  <div className="gap-stat-number">{gap.required}</div>
                  <div className="gap-stat-label">Required</div>
                </div>
                <div className="gap-stat">
                  <div className="gap-stat-number gap-stat-available">
                    {gap.available}
                  </div>
                  <div className="gap-stat-label">Available</div>
                </div>
                <div className="gap-stat">
                  <div className="gap-stat-number gap-stat-gap">{gap.gap}</div>
                  <div className="gap-stat-label">Gap</div>
                </div>
              </div>
              <div className="gap-progress-container">
                <div className="gap-progress-bar">
                  <div
                    className="gap-progress-fill"
                    style={{
                      width: `${(gap.available / gap.required) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="recommendations-card">
        <h4 className="recommendations-title">
          <TrendingUp className="recommendations-icon" />
          Recommendations
        </h4>
        <ul className="recommendations-list">
          <li>• Consider hiring external talent for Kubernetes expertise</li>
          <li>• Upskill existing team members in ML technologies</li>
          <li>• Recruit additional UI/UX designers for upcoming projects</li>
        </ul>
      </div>
    </div>
  );
};

export default SkillGapAnalysis;
