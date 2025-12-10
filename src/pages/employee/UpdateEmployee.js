import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
//import InputField from "../../components/inputfield/InputField";
//import Button from "../../components/button/Button";
import "./UpdateEmployee.css";
import {
    SKILL_OPTIONS,
    INTEREST_OPTIONS,
    LOCATION_OPTIONS,
    STATUS_OPTIONS,
    CONTRACT_TYPE_OPTIONS,
    CONTRACT_HOURS_MAP,
    INITIAL_EMPLOYEE_STATE,
    INITIAL_EXPERIENCE,
    normalizeEmployeeData,
} from "../../constant/employeeConstants.js";
import { toast } from "react-toastify";

// Automatically choose mock or real API
const useMock = process.env.REACT_APP_USE_MOCK === "true";

console.log("Using mock for Employee Update:", useMock);

const { getEmployeeById, updateEmployeeById } = useMock
    ? require("../../services/mock/mockEmployeeApi")
    : require("../../services/employee/employeeApi");


// Mock InputField component - replace with your actual component
const InputField = ({ label, type, name, value, onChange, placeholder, disabled }) => (
    <div className="form-field">
        <label>{label}</label>
        <input
            type={type}
            name={name}
            value={value || ""}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            className="autocomplete-input"
        />
    </div>
);

// Mock Button component - replace with your actual component
const Button = ({ type, label, onClick, disabled, loading, variant }) => (
    <button
        type={type}
        onClick={onClick}
        disabled={disabled || loading}
        className={`add-role-btn ${variant === "danger" ? "remove-role-btn" : ""}`}
        style={variant === "danger" ? { width: "auto", padding: "10px 24px", borderRadius: "6px" } : {}}
    >
        {label}
    </button>
);

const UpdateEmployee = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // State for managing options (allows adding custom entries)
    const [skillOptions, setSkillOptions] = useState(SKILL_OPTIONS);
    const [interestOptions, setInterestOptions] = useState(INTEREST_OPTIONS);
    const [locationOptions] = useState(LOCATION_OPTIONS);

    const [formData, setFormData] = useState(INITIAL_EMPLOYEE_STATE);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    // UI state
    const [skillInput, setSkillInput] = useState("");
    const [showSkillDropdown, setShowSkillDropdown] = useState(false);
    const [interestInput, setInterestInput] = useState("");
    const [showInterestDropdown, setShowInterestDropdown] = useState(false);
    const [locationInput, setLocationInput] = useState("");
    const [showLocationDropdown, setShowLocationDropdown] = useState(false);

    // Refs
    const skillDropdownRef = useRef(null);
    const interestDropdownRef = useRef(null);
    const locationDropdownRef = useRef(null);

    // Fetch employee data on mount
    useEffect(() => {
        const loadEmployeeData = async () => {
            try {
                const storedData = location.state.employeeData || JSON.parse(localStorage.getItem("loginResponse") || "null");

                console.log("StoredData:", storedData);

                const employeeIdFromLogin = storedData.employeeId;

                const apiData = await getEmployeeById(employeeIdFromLogin);

                console.log("apiData:", apiData.data);

                const normalizedData = normalizeEmployeeData(apiData.data);
                console.log("Normalized Data:", normalizedData);
                setFormData(normalizedData);
                setInitialLoading(false);
            } catch (error) {
                console.error("Error loading employee:", error);
                toast.error("Failed to load employee data");
                setFormData({ ...INITIAL_EMPLOYEE_STATE });
                setInitialLoading(false);
            }
        };

        loadEmployeeData();
    }, [location.state]);

    // Click outside handler
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (skillDropdownRef.current && !skillDropdownRef.current.contains(event.target)) {
                setShowSkillDropdown(false);
            }
            if (interestDropdownRef.current && !interestDropdownRef.current.contains(event.target)) {
                setShowInterestDropdown(false);
            }
            if (locationDropdownRef.current && !locationDropdownRef.current.contains(event.target)) {
                setShowLocationDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));

        // Auto-populate hours per week based on contract type
        if (name === "contractType") {
            const hours = CONTRACT_HOURS_MAP[value] || "";
            setFormData(prev => ({ ...prev, capacity: hours }));
        }
    };

    // Skills handlers
    const handleSkillSelect = (skill) => {
        if (!formData.selectedSkills.includes(skill)) {
            setFormData((prev) => ({
                ...prev,
                selectedSkills: [...prev.selectedSkills, skill]
            }));
            if (!skillOptions.includes(skill)) {
                setSkillOptions((prev) => [...prev, skill]);
            }
        }
        setSkillInput("");
        setTimeout(() => {
            document.querySelector(".skills-section .autocomplete-input")?.focus();
        }, 0);
    };

    const handleRemoveSkill = (skill) => {
        setFormData((prev) => ({
            ...prev,
            selectedSkills: prev.selectedSkills.filter(s => s !== skill)
        }));
    };

    const getFilteredSkills = () => {
        return skillOptions.filter(
            skill => skill.toLowerCase().includes(skillInput.toLowerCase()) &&
                !formData.selectedSkills.includes(skill)
        );
    };

    // Interests handlers
    const handleInterestSelect = (interest) => {
        if (!formData.selectedInterests.includes(interest)) {
            setFormData((prev) => ({
                ...prev,
                selectedInterests: [...prev.selectedInterests, interest]
            }));
            if (!interestOptions.includes(interest)) {
                setInterestOptions((prev) => [...prev, interest]);
            }
        }
        setInterestInput("");
        setTimeout(() => {
            document.querySelector(".interest-section .autocomplete-input")?.focus();
        }, 0);
    };

    const handleRemoveInterest = (interest) => {
        setFormData((prev) => ({
            ...prev,
            selectedInterests: prev.selectedInterests.filter(i => i !== interest)
        }));
    };

    const getFilteredInterests = () => {
        return interestOptions.filter(
            interest => interest.toLowerCase().includes(interestInput.toLowerCase()) &&
                !formData.selectedInterests.includes(interest)
        );
    };

    // Location handlers
    const handleLocationSelect = (location) => {
        setFormData((prev) => ({
            ...prev,
            primaryLocation: location
        }));
        setLocationInput("");
        setShowLocationDropdown(false);
    };

    const getFilteredLocations = () => {
        return locationOptions.filter(
            location => location.toLowerCase().includes(locationInput.toLowerCase())
        );
    };

    // Experience handlers
    const addExperience = () => {
        setFormData((prev) => ({
            ...prev,
            experiences: [...prev.experiences, { ...INITIAL_EXPERIENCE }]
        }));
    };

    const removeExperience = (index) => {
        setFormData((prev) => ({
            ...prev,
            experiences: prev.experiences.filter((_, i) => i !== index)
        }));
    };

    const handleExperienceChange = (index, field, value) => {
        setFormData((prev) => ({
            ...prev,
            experiences: prev.experiences.map((exp, i) =>
                i === index ? { ...exp, [field]: value } : exp
            )
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {

            const response = await updateEmployeeById(formData.employeeId, formData);

            console.log("Employee updated:", response.data, formData);
            toast.success("Employee profile updated successfully!");
            if (location.state.from === "employee") {
                navigate("/employee_dashboard");
            } else {
                navigate(-1);
            }
        } catch (error) {
            console.error("Update failed:", error);
            toast.error("Failed to update employee.");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        if (location.state.from === "employee") {
            navigate("/employee_dashboard");
        } else {
            navigate(-1);
        }
    };

    const isFormValid = formData.firstName.trim() &&
        formData.lastName.trim() &&
        formData.email.trim() &&
        formData.department &&
        formData.position;

    if (initialLoading) {
        return (
            <div className="create-project-container">
                <div className="loading-state">Loading employee data...</div>
            </div>
        );
    }

    return (
        <div className="create-project-container">
            <button
                type="button"
                className="remove-btn"
                onClick={handleCancel}
                title="Close Update Employee Page"
            >
                ✕
            </button>
            <h2>Employee Profile</h2>
            <form onSubmit={handleSubmit} className="create-project-form">

                {/* Basic Information Section */}
                <div className="roles-section" style={{ marginTop: 0, paddingTop: 0, borderTop: "none" }}>

                    <InputField
                        label="Employee ID"
                        type="text"
                        name="id"
                        value={formData.employeeId}
                        onChange={handleChange}
                        disabled={true}
                    />

                    <div className="role-fields-grid">
                        <InputField
                            label="First Name"
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            disabled={true}
                        />

                        <InputField
                            label="Last Name"
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            disabled={true}
                        />
                    </div>

                    <InputField
                        label="Email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={true}
                    />

                    <InputField
                        label="Emergency Contact"
                        type="text"
                        name="emergencyContact"
                        value={formData.emergencyContact}
                        onChange={handleChange}
                        placeholder="e.g., +49 1555012345654"
                    />

                    {/* Department Dropdown */}
                    <InputField
                        label="Department"
                        type="text"
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        disabled={true}
                    />

                    {/* Position with Autocomplete */}
                    <InputField
                        label="Position"
                        type="text"
                        name="position"
                        value={formData.position}
                        onChange={handleChange}
                        disabled={true}
                    />

                    {/* Supervisor Dropdown */}
                    <InputField
                        label="Supervisor"
                        type="text"
                        name="supervisor"
                        value={formData.supervisor}
                        onChange={handleChange}
                        disabled={true}
                    />

                    {/* Primary Location */}
                    <div className="form-field">
                        <label>Base Location</label>
                        {formData.primaryLocation ? (
                            <div className="selected-value">
                                <span>{formData.primaryLocation}</span>
                                <button
                                    type="button"
                                    className="clear-selection"
                                    onClick={() => setFormData(prev => ({ ...prev, primaryLocation: "" }))}
                                >
                                    ×
                                </button>
                            </div>
                        ) : (
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
                                    placeholder="Select or type location"
                                />
                                {showLocationDropdown && (
                                    <div className="autocomplete-dropdown">
                                        {getFilteredLocations().map((loc, idx) => (
                                            <div
                                                key={idx}
                                                className="autocomplete-item"
                                                onMouseDown={(e) => {
                                                    e.preventDefault();
                                                    handleLocationSelect(loc);
                                                }}
                                            >
                                                {loc}
                                            </div>
                                        ))}
                                        {locationInput.trim() && (
                                            <div
                                                className="autocomplete-item add-new"
                                                onMouseDown={(e) => {
                                                    e.preventDefault();
                                                    handleLocationSelect(locationInput.trim());
                                                }}
                                            >
                                                + Add "{locationInput.trim()}"
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Skills Section */}
                    <div className="skills-section">
                        <label>Skills</label>
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
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && skillInput.trim()) {
                                        e.preventDefault();
                                        handleSkillSelect(skillInput.trim());
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
                                                e.preventDefault();
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
                                                e.preventDefault();
                                                handleSkillSelect(skillInput.trim());
                                            }}
                                        >
                                            + Add "{skillInput.trim()}"
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {(formData?.selectedSkills || "").length > 0 && (
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

                    {/* Interests Section */}
                    <div className="interest-section skills-section">
                        <label>Interests</label>
                        <div className="autocomplete-container" ref={interestDropdownRef}>
                            <input
                                type="text"
                                className="autocomplete-input"
                                value={interestInput}
                                onChange={(e) => {
                                    setInterestInput(e.target.value);
                                    setShowInterestDropdown(true);
                                }}
                                onFocus={() => setShowInterestDropdown(true)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && interestInput.trim()) {
                                        e.preventDefault();
                                        handleInterestSelect(interestInput.trim());
                                    }
                                }}
                                placeholder="Type to search or add interests"
                            />
                            {showInterestDropdown && (
                                <div className="autocomplete-dropdown">
                                    {getFilteredInterests().map((interest, idx) => (
                                        <div
                                            key={idx}
                                            className="autocomplete-item"
                                            onMouseDown={(e) => {
                                                e.preventDefault();
                                                handleInterestSelect(interest);
                                            }}
                                        >
                                            {interest}
                                        </div>
                                    ))}
                                    {interestInput.trim() && (
                                        <div
                                            className="autocomplete-item add-new"
                                            onMouseDown={(e) => {
                                                e.preventDefault();
                                                handleInterestSelect(interestInput.trim());
                                            }}
                                        >
                                            + Add "{interestInput.trim()}"
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {(formData?.selectedInterests || "").length > 0 && (
                            <div className="tags-container">
                                {formData.selectedInterests.map((interest, idx) => (
                                    <span key={idx} className="tag">
                                        {interest}
                                        <button
                                            type="button"
                                            className="tag-remove"
                                            onClick={() => handleRemoveInterest(interest)}
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Availability Section */}
                <div className="roles-section">
                    <h3 style={{ color: "#1e3a8a", marginBottom: "16px", fontSize: "20px" }}>Availability</h3>

                    <div className="form-field">
                        <label>Status</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="autocomplete-input"
                            style={{ cursor: "pointer" }}
                        >
                            {STATUS_OPTIONS.map((status, idx) => (
                                <option key={idx} value={status}>{status}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-field">
                        <label>Contract Type</label>
                        <select
                            name="contractType"
                            value={formData.contractType}
                            onChange={handleChange}
                            className="autocomplete-input"
                            style={{ cursor: "pointer" }}
                        >
                            {CONTRACT_TYPE_OPTIONS.map((type, idx) => (
                                <option key={idx} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>

                    {formData.status === "Partially Available" && (
                        <div className="date-fields-row">
                            <div className="date-field">
                                <label>Contract Start Date</label>
                                <input
                                    type="date"
                                    name="contractStartDate"
                                    value={formData.contractStartDate}
                                    onChange={handleChange}
                                    className="date-input"
                                />
                            </div>

                            <div className="date-field">
                                <label>Contract End Date</label>
                                <input
                                    type="date"
                                    name="contractEndDate"
                                    value={formData.contractEndDate}
                                    onChange={handleChange}
                                    className="date-input"
                                />
                            </div>
                        </div>
                    )}

                    <InputField
                        label="Capacity"
                        type="number"
                        name="capacity"
                        value={formData.capacity}
                        onChange={handleChange}
                        placeholder="e.g., 40"
                        min="1"
                        max="168"
                    />
                </div>

                {/* Experience Section */}
                <div className="roles-section">
                    <div className="roles-header">
                        <h3 style={{ fontSize: "20px" }}>Work Experience</h3>
                        <button type="button" className="add-role-btn" onClick={addExperience}>
                            + Add Experience
                        </button>
                    </div>

                    {(formData?.experiences || "").length > 0 && (
                        <div className="roles-list">
                            {formData.experiences.map((exp, index) => (
                                <div key={index} className="role-card">
                                    <div className="role-card-header">
                                        <h4>Experience #{index + 1}</h4>
                                        <button
                                            type="button"
                                            className="remove-role-btn"
                                            onClick={() => removeExperience(index)}
                                            title="Remove experience"
                                        >
                                            ✕
                                        </button>
                                    </div>

                                    <div className="form-field">
                                        <label>Role</label>
                                        <input
                                            type="text"
                                            className="autocomplete-input"
                                            value={exp.role || ""}
                                            onChange={(e) => handleExperienceChange(index, "role", e.target.value)}
                                            placeholder="e.g., Senior Developer"
                                        />
                                    </div>

                                    <div className="form-field">
                                        <label>Company</label>
                                        <input
                                            type="text"
                                            className="autocomplete-input"
                                            value={exp.company || ""}
                                            onChange={(e) => handleExperienceChange(index, "company", e.target.value)}
                                            placeholder="e.g., Tech Corp"
                                        />
                                    </div>

                                    <div className="date-fields-row">
                                        <div className="date-field">
                                            <label>Start Date</label>
                                            <input
                                                type="date"
                                                name={`startDate-${index}`}
                                                value={exp.startDate || ""}
                                                onChange={(e) => handleExperienceChange(index, "startDate", e.target.value)}
                                                className="date-input"
                                            />
                                        </div>

                                        <div className="date-field">
                                            <label>End Date</label>
                                            <input
                                                type="date"
                                                name={`endDate-${index}`}
                                                value={exp.endDate || ""}
                                                onChange={(e) => handleExperienceChange(index, "endDate", e.target.value)}
                                                className="date-input"
                                            />
                                        </div>
                                    </div>

                                    <div className="textarea-field">
                                        <label>Description</label>
                                        <textarea
                                            value={exp.description || ""}
                                            onChange={(e) => handleExperienceChange(index, "description", e.target.value)}
                                            placeholder="Describe your role and responsibilities"
                                            style={{ minHeight: "80px" }}
                                        ></textarea>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {(formData?.experiences || "").length === 0 && (
                        <div className="empty-roles-message">
                            <p>No work experience added yet. Click "Add Experience" to get started.</p>
                        </div>
                    )}
                </div>

                <Button
                    type="submit"
                    label={loading ? "Updating..." : "Update Profile"}
                    disabled={!isFormValid || loading}
                    loading={loading}
                />
                <Button
                    type="button"
                    label="Cancel"
                    onClick={handleCancel}
                    variant="danger"
                />
            </form>
        </div>
    );
};

export default UpdateEmployee;