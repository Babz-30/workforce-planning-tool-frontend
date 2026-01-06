import { useState } from "react";
import "./SkillsFilter.css"; // Import the CSS file

function SkillsFilter({ allSkills, selectedSkills, toggleSkill }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="filter-section">
      <div
        className={`filter-header ${isOpen ? "active" : ""}`}
        onClick={toggleDropdown}
        role="button"
        tabIndex={0}
        onKeyPress={(e) => e.key === "Enter" && toggleDropdown()}
      >
        <div className="form-label">
          <span>Filter by Skills</span>
          {selectedSkills.length > 0 && (
            <span className="selected-count">{selectedSkills.length}</span>
          )}
        </div>
        <svg
          className={`dropdown-icon ${isOpen ? "rotated" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>

      <div className={`skills-filter ${isOpen ? "show" : ""}`}>
        {allSkills.map((skill) => (
          <button
            key={skill}
            onClick={() => toggleSkill(skill)}
            className={`skill-filter-btn ${
              selectedSkills.includes(skill) ? "skill-filter-btn-active" : ""
            }`}
          >
            {skill}
          </button>
        ))}
      </div>
    </div>
  );
}

export default SkillsFilter;
