// CreateProject.js
import React, { useState, useEffect, useRef, useCallback } from "react";
import InputField from "../../components/inputfield/InputField";
import Button from "../../components/button/Button";
import "./CreateProject.css";
import { toast } from "react-toastify";

const CreateProject = () => {
  // Predefined options
  const [skillOptions, setSkillOptions] = useState([
    "Solidity", "Ethereum", "Web3.js", "Node.js", "Cryptography",
    "React", "Python", "JavaScript", "TypeScript", "Java",
    "Docker", "Kubernetes", "AWS", "Azure", "MongoDB"
  ]);

  const [roleOptions, setRoleOptions] = useState([
    "Blockchain Developer", "Smart Contract Engineer", "Backend Developer",
    "Frontend Developer", "Full Stack Developer", "Security Specialist",
    "DevOps Engineer", "UI/UX Designer", "Project Manager", "QA Engineer"
  ]);

  const [competencyOptions, setCompetencyOptions] = useState([
    "Blockchain", "Smart Contracts", "Web Development", "Mobile Development",
    "Cloud Computing", "Database Management", "API Development",
    "Security", "Testing", "Project Management", "UI/UX Design"
  ]);

  const [locationOptions, setLocationOptions] = useState([
    "Remote", "Frankfurt", "Berlin", "Munich", "Hamburg", "Singapore",
    "London", "New York", "San Francisco", "Tokyo", "Hybrid"
  ]);

  const [formData, setFormData] = useState({
    projectDescription: "",
    projectStart: "",
    projectEnd: "",
    taskDescription: "",
    requiredEmployees: "",
    links: "",
    selectedSkills: [],
    selectedLocations: [],
    roles: [],
  });

  const [loading, setLoading] = useState(false);

  // Skills management
  const [skillInput, setSkillInput] = useState("");
  const [showSkillDropdown, setShowSkillDropdown] = useState(false);

  // Location management
  const [locationInput, setLocationInput] = useState("");
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);

  // Refs for click outside detection
  const skillDropdownRef = useRef(null);
  const locationDropdownRef = useRef(null);
  const roleDropdownRefs = useRef([]);
  const competencyDropdownRefs = useRef([]);

  // Stable role change handler (useCallback so effect deps are safe)
  const handleRoleChange = useCallback((index, field, value) => {
    setFormData(prev => {
      const updatedRoles = prev.roles.map((role, i) =>
        i === index ? { ...role, [field]: value } : role
      );
      return {
        ...prev,
        roles: updatedRoles,
      };
    });
  }, []);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Prevent closing if clicking on input field itself
      const isInput = event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA';

      // Close skill dropdown
      if (skillDropdownRef.current && !skillDropdownRef.current.contains(event.target)) {
        setShowSkillDropdown(false);
      }

      // Close location dropdown
      if (locationDropdownRef.current && !locationDropdownRef.current.contains(event.target)) {
        setShowLocationDropdown(false);
      }

      // Close role & competency dropdowns
      if (!isInput) {
        roleDropdownRefs.current.forEach((ref, index) => {
          if (ref && !ref.contains(event.target)) {
            handleRoleChange(index, "showRoleDropdown", false);
          }
        });

        competencyDropdownRefs.current.forEach((ref, index) => {
          if (ref && !ref.contains(event.target)) {
            handleRoleChange(index, "showCompetencyDropdown", false);
          }
        });
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleRoleChange]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle skill selection
  const handleSkillSelect = (skill) => {
    setFormData(prev => {
      if (!prev.selectedSkills.includes(skill)) {
        // Add to selected
        const updated = {
          ...prev,
          selectedSkills: [...prev.selectedSkills, skill],
        };
        // Add to options if new
        if (!skillOptions.includes(skill)) {
          setSkillOptions(prevOpts => [...prevOpts, skill]);
        }
        return updated;
      }
      return prev;
    });

    setSkillInput("");
    // Keep dropdown open for multiple selections and refocus
    setTimeout(() => {
      const input = document.querySelector('.skills-section .autocomplete-input');
      if (input) input.focus();
    }, 0);
  };

  // Add custom skill
  const handleAddCustomSkill = () => {
    const trimmedSkill = skillInput.trim();
    if (trimmedSkill) {
      // handleSkillSelect already guards duplicates
      handleSkillSelect(trimmedSkill);
    }
  };

  // Remove skill
  const handleRemoveSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      selectedSkills: prev.selectedSkills.filter(skill => skill !== skillToRemove),
    }));
  };

  // Filter skills based on input
  const getFilteredSkills = () => {
    return skillOptions.filter(skill =>
      skill.toLowerCase().includes(skillInput.toLowerCase()) &&
      !formData.selectedSkills.includes(skill)
    );
  };

  // Handle location selection
  const handleLocationSelect = (location) => {
    setFormData(prev => {
      if (prev.selectedLocations.length < 3 && !prev.selectedLocations.includes(location)) {
        // Add to options if new
        if (!locationOptions.includes(location)) {
          setLocationOptions(prevOpts => [...prevOpts, location]);
        }
        return {
          ...prev,
          selectedLocations: [...prev.selectedLocations, location],
        };
      }
      return prev;
    });

    setLocationInput("");
    // Keep dropdown open for multiple selections
    setTimeout(() => {
      const input = document.querySelector('.location-section .autocomplete-input');
      if (input) input.focus();
    }, 0);
  };

  // Add custom location
  const handleAddCustomLocation = () => {
    const trimmedLocation = locationInput.trim();
    if (trimmedLocation) {
      handleLocationSelect(trimmedLocation);
    }
  };

  // Remove location
  const handleRemoveLocation = (locationToRemove) => {
    setFormData(prev => ({
      ...prev,
      selectedLocations: prev.selectedLocations.filter(loc => loc !== locationToRemove),
    }));
  };

  // Filter locations based on input
  const getFilteredLocations = () => {
    return locationOptions.filter(location =>
      location.toLowerCase().includes(locationInput.toLowerCase()) &&
      !formData.selectedLocations.includes(location)
    );
  };

  // Handle role selection
  const handleRoleSelect = (index, selectedRole) => {
    setFormData(prev => {
      const updatedRoles = prev.roles.map((role, i) =>
        i === index ? { ...role, requiredRole: selectedRole, roleInput: "", showRoleDropdown: false } : role
      );
      return {
        ...prev,
        roles: updatedRoles,
      };
    });

    // Add to options if new
    if (!roleOptions.includes(selectedRole)) {
      setRoleOptions(prev => [...prev, selectedRole]);
    }
  };

  // Handle competency selection for a role
  const handleCompetencySelect = (index, competency) => {
    setFormData(prev => {
      const role = prev.roles[index];
      if (!role.requiredCompetencies.includes(competency)) {
        const updatedRoles = prev.roles.map((r, i) =>
          i === index ? {
            ...r,
            requiredCompetencies: [...r.requiredCompetencies, competency],
            competencyInput: ""
          } : r
        );
        return {
          ...prev,
          roles: updatedRoles,
        };
      }
      return prev;
    });

    // Add to options if new
    if (!competencyOptions.includes(competency)) {
      setCompetencyOptions(prev => [...prev, competency]);
    }
    // Keep dropdown open and refocus for multiple selections
    setTimeout(() => {
      const inputs = document.querySelectorAll('.role-card .autocomplete-input');
      if (inputs[index * 2 + 1]) inputs[index * 2 + 1].focus();
    }, 0);
  };

  // Remove competency from role
  const handleRemoveCompetency = (roleIndex, competency) => {
    setFormData(prev => {
      const updatedRoles = prev.roles.map((role, i) =>
        i === roleIndex ? {
          ...role,
          requiredCompetencies: role.requiredCompetencies.filter(c => c !== competency)
        } : role
      );
      return {
        ...prev,
        roles: updatedRoles,
      };
    });
  };

  // Add custom role
  const handleAddCustomRole = (index) => {
    const role = formData.roles[index];
    const trimmedRole = role?.roleInput?.trim();
    if (trimmedRole) {
      handleRoleSelect(index, trimmedRole);
    }
  };

  // Add custom competency
  const handleAddCustomCompetency = (index) => {
    const role = formData.roles[index];
    const trimmedComp = role?.competencyInput?.trim();
    if (trimmedComp) {
      handleCompetencySelect(index, trimmedComp);
    }
  };

  // Add a new role manually
  const addRole = () => {
    setFormData(prev => ({
      ...prev,
      roles: [
        ...prev.roles,
        {
          requiredRole: "",
          requiredCompetencies: [],
          capacity: "",
          numberOfEmployees: "",
          roleInput: "",
          competencyInput: "",
          showRoleDropdown: false,
          showCompetencyDropdown: false,
        },
      ],
    }));
  };

  // Remove a specific role
  const removeRole = (index) => {
    setFormData(prev => {
      const updatedRoles = prev.roles.filter((_, i) => i !== index);
      return {
        ...prev,
        roles: updatedRoles,
      };
    });
  };

  // Calculate total employees from roles
  const getTotalEmployeesFromRoles = () => {
    return formData.roles.reduce((total, role) => {
      const num = parseInt(role.numberOfEmployees) || 0;
      return total + num;
    }, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("Project created:", formData);
      toast.success("Project created successfully!");
      setFormData({
        projectDescription: "",
        projectStart: "",
        projectEnd: "",
        taskDescription: "",
        requiredEmployees: "",
        links: "",
        selectedSkills: [],
        selectedLocations: [],
        roles: [],
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to create project.");
    } finally {
      setLoading(false);
    }
  };

  const isFormValid =
    formData.projectDescription.trim() &&
    formData.projectStart.trim() &&
    formData.projectEnd.trim();

  return (
    <div className="create-project-container">
      <h2>Create New Project</h2>
      <form onSubmit={handleSubmit} className="create-project-form">
        <InputField
          label="Project Description"
          type="text"
          name="projectDescription"
          value={formData.projectDescription}
          onChange={handleChange}
          placeholder="Enter project description"
        />

        <div className="date-fields-row">
          <div className="date-field">
            <label>Project Start</label>
            <input
              type="date"
              name="projectStart"
              value={formData.projectStart}
              onChange={handleChange}
              className="date-input"
            />
          </div>

          <div className="date-field">
            <label>Project End</label>
            <input
              type="date"
              name="projectEnd"
              value={formData.projectEnd}
              onChange={handleChange}
              className="date-input"
            />
          </div>
        </div>

        <div className="textarea-field">
          <label>Task Description (Detailed)</label>
          <textarea
            name="taskDescription"
            value={formData.taskDescription}
            onChange={handleChange}
            placeholder="Describe the main tasks in detail"
          ></textarea>
        </div>

        {/* Skills Section */}
        <div className="skills-section">
          <label>Skills Needed for Project</label>
          <div className="autocomplete-container" ref={skillDropdownRef}>
            <input
              type="text"
              className="autocomplete-input"
              value={skillInput}
              onChange={(e) => {
                setSkillInput(e.target.value);
                setShowSkillDropdown(true);
              }}
              onFocus={() => setShowSkillDropdown(true)}
              onBlur={() => {
                // Only close if not clicking inside dropdown
                setTimeout(() => {
                  if (!skillDropdownRef.current?.contains(document.activeElement)) {
                    setShowSkillDropdown(false);
                  }
                }, 150);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  if (skillInput.trim()) {
                    handleAddCustomSkill();
                  }
                }
              }}
              placeholder="Type to search or add skills"
            />
            {showSkillDropdown && (
              <div className="autocomplete-dropdown">
                {getFilteredSkills().map((skill, idx) => (
                  <div
                    key={idx}
                    className="autocomplete-item"
                    onMouseDown={(e) => {
                      e.preventDefault(); // Prevent blur
                      handleSkillSelect(skill);
                    }}
                  >
                    {skill}
                  </div>
                ))}
                {skillInput.trim() && (
                  <div
                    className="autocomplete-item add-new"
                    onMouseDown={(e) => {
                      e.preventDefault(); // Prevent blur
                      handleAddCustomSkill();
                    }}
                  >
                    + Add "{skillInput.trim()}"
                  </div>
                )}
              </div>
            )}
          </div>

          {formData.selectedSkills.length > 0 && (
            <div className="tags-container">
              {formData.selectedSkills.map((skill, idx) => (
                <span key={idx} className="tag">
                  {skill}
                  <button
                    type="button"
                    className="tag-remove"
                    onClick={() => handleRemoveSkill(skill)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Location Section */}
        <div className="location-section">
          <label>Location (Select up to 3 convenient locations)</label>
          <div className="autocomplete-container" ref={locationDropdownRef}>
            <input
              type="text"
              className="autocomplete-input"
              value={locationInput}
              onChange={(e) => {
                setLocationInput(e.target.value);
                setShowLocationDropdown(true);
              }}
              onFocus={() => setShowLocationDropdown(true)}
              onBlur={() => {
                setTimeout(() => {
                  if (!locationDropdownRef.current?.contains(document.activeElement)) {
                    setShowLocationDropdown(false);
                  }
                }, 150);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  if (locationInput.trim()) {
                    handleAddCustomLocation();
                  }
                }
              }}
              placeholder="Type to search or add locations"
              disabled={formData.selectedLocations.length >= 3}
            />
            {showLocationDropdown && formData.selectedLocations.length < 3 && (
              <div className="autocomplete-dropdown">
                {getFilteredLocations().map((location, idx) => (
                  <div
                    key={idx}
                    className="autocomplete-item"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleLocationSelect(location);
                    }}
                  >
                    {location}
                  </div>
                ))}
                {locationInput.trim() && (
                  <div
                    className="autocomplete-item add-new"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleAddCustomLocation();
                    }}
                  >
                    + Add "{locationInput.trim()}"
                  </div>
                )}
              </div>
            )}
          </div>

          {formData.selectedLocations.length > 0 && (
            <div className="tags-container">
              {formData.selectedLocations.map((location, idx) => (
                <span key={idx} className="tag">
                  {location}
                  <button
                    type="button"
                    className="tag-remove"
                    onClick={() => handleRemoveLocation(location)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
          {formData.selectedLocations.length >= 3 && (
            <p className="info-text">Maximum 3 locations selected</p>
          )}
        </div>

        <InputField
          label="Links / URL"
          type="url"
          name="links"
          value={formData.links}
          onChange={handleChange}
          placeholder="Add any related links"
        />

        {/* Dynamic Roles Section */}
        <div className="roles-section">
          <div className="roles-header">
            <h3>Project Roles</h3>
            <button
              type="button"
              className="add-role-btn"
              onClick={addRole}
            >
              + Add Role
            </button>
          </div>

          {formData.roles.length > 0 && getTotalEmployeesFromRoles() > 0 && (
            <div className="employee-summary">
              <span className="summary-label">Employees allocated:</span>
              <span className="summary-count">{getTotalEmployeesFromRoles()}</span>
              {formData.requiredEmployees && (
                <span className="summary-total">/ {formData.requiredEmployees} total</span>
              )}
            </div>
          )}

          {formData.roles.length > 0 && (
            <div className="roles-list">
              {formData.roles.map((role, index) => (
                <div key={index} className="role-card">
                  <div className="role-card-header">
                    <h4>Role #{index + 1}</h4>
                    <button
                      type="button"
                      className="remove-role-btn"
                      onClick={() => removeRole(index)}
                      title="Remove role"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="role-fields-grid">
                    {/* Role Selection */}
                    <div className="form-field">
                      <label>Required Role</label>
                      {role.requiredRole ? (
                        <div className="selected-value">
                          <span>{role.requiredRole}</span>
                          <button
                            type="button"
                            className="clear-selection"
                            onClick={() => handleRoleChange(index, "requiredRole", "")}
                          >
                            ×
                          </button>
                        </div>
                      ) : (
                        <div
                          className="autocomplete-container"
                          ref={el => roleDropdownRefs.current[index] = el}
                        >
                          <input
                            type="text"
                            className="autocomplete-input"
                            value={role.roleInput}
                            onChange={(e) => handleRoleChange(index, "roleInput", e.target.value)}
                            onFocus={() => handleRoleChange(index, "showRoleDropdown", true)}
                            placeholder="Select or type role"
                          />
                          {role.showRoleDropdown && (
                            <div className="autocomplete-dropdown">
                              {roleOptions
                                .filter(r => r.toLowerCase().includes(role.roleInput.toLowerCase()))
                                .map((r, idx) => (
                                  <div
                                    key={idx}
                                    className="autocomplete-item"
                                    onMouseDown={(e) => {
                                      e.preventDefault();
                                      handleRoleSelect(index, r);
                                    }}
                                  >
                                    {r}
                                  </div>
                                ))}
                              {role.roleInput.trim() && (
                                <div
                                  className="autocomplete-item add-new"
                                  onMouseDown={(e) => {
                                    e.preventDefault();
                                    handleAddCustomRole(index);
                                  }}
                                >
                                  + Add "{role.roleInput.trim()}"
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Number of Employees for this Role */}
                    <div className="form-field">
                      <label>Number of Employees</label>
                      <input
                        type="number"
                        className="autocomplete-input"
                        value={role.numberOfEmployees}
                        onChange={(e) => handleRoleChange(index, "numberOfEmployees", e.target.value)}
                        placeholder="e.g. 2"
                        min="1"
                      />
                    </div>
                  </div>

                  {/* Competencies Selection */}
                  <div className="form-field">
                    <label>Required Competencies</label>
                    <div
                      className="autocomplete-container"
                      ref={el => competencyDropdownRefs.current[index] = el}
                    >
                      <input
                        type="text"
                        className="autocomplete-input"
                        value={role.competencyInput}
                        onChange={(e) => handleRoleChange(index, "competencyInput", e.target.value)}
                        onFocus={() => handleRoleChange(index, "showCompetencyDropdown", true)}
                        onBlur={() => {
                          setTimeout(() => {
                            const ref = competencyDropdownRefs.current[index];
                            if (ref && !ref.contains(document.activeElement)) {
                              handleRoleChange(index, "showCompetencyDropdown", false);
                            }
                          }, 150);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            if (role.competencyInput.trim()) {
                              handleAddCustomCompetency(index);
                            }
                          }
                        }}
                        placeholder="Select or type competencies"
                      />
                      {role.showCompetencyDropdown && (
                        <div className="autocomplete-dropdown">
                          {competencyOptions
                            .filter(c =>
                              c.toLowerCase().includes(role.competencyInput.toLowerCase()) &&
                              !role.requiredCompetencies.includes(c)
                            )
                            .map((c, idx) => (
                              <div
                                key={idx}
                                className="autocomplete-item"
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  handleCompetencySelect(index, c);
                                }}
                              >
                                {c}
                              </div>
                            ))}
                          {role.competencyInput.trim() && (
                            <div
                              className="autocomplete-item add-new"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                handleAddCustomCompetency(index);
                              }}
                            >
                              + Add "{role.competencyInput.trim()}"
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {role.requiredCompetencies.length > 0 && (
                      <div className="tags-container">
                        {role.requiredCompetencies.map((comp, idx) => (
                          <span key={idx} className="tag">
                            {comp}
                            <button
                              type="button"
                              className="tag-remove"
                              onClick={() => handleRemoveCompetency(index, comp)}
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Capacity */}
                  <InputField
                    label="Capacity (hours/week per role)"
                    type="text"
                    name={`capacity-${index}`}
                    value={role.capacity}
                    onChange={(e) => handleRoleChange(index, "capacity", e.target.value)}
                    placeholder="e.g. 40hrs/week"
                  />
                </div>
              ))}
            </div>
          )}

          {formData.roles.length === 0 && (
            <div className="empty-roles-message">
              <p>No roles added yet. Click "Add Role" to get started.</p>
            </div>
          )}
        </div>

        <Button
          type="submit"
          label={loading ? "Creating..." : "Create Project"}
          disabled={!isFormValid || loading}
          loading={loading}
        />
      </form>
    </div>
  );
};

export default CreateProject;
