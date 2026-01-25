import { useState, useEffect } from "react";
import {
  Search,
  // Users,
  TrendingUp,
  // CheckCircle,
  UserPlus,
  FileText,
} from "lucide-react";
import "./ResourcePlanner.css";
import { getAllEmployee } from "../../services/employee/employeeApi";
import { transformEmployeesForResourcePlanner } from "../../helper/apiBinder";
import { transformProjectDetails } from "../../helper/apiBinder";
import { GetAllPublishedProject } from "../../services/project/getprojects";
import Pagination from "../../components/pagination/Pagination"; // Import the pagination component
import UserProfile from "../../components/profile/profile";
import ProposeTabContent from "../../components/rp_propose/proposeTab";
import SkillGapAnalysis from "../../components/rp_skill_gap_analysis/skillGapAnalysisTab";
import { calculateSkillGaps } from "../../helper/skillGap";
import {
  GetAllApplication,
  GetAllCompletedApplication,
} from "../../services/application/GetApplicationAPI";
import getAppliedEmployees from "../../helper/DuplicateEmployeeBinder";
import EmployeeSearch from "../../components/rp_skill_search/searchskillTab";
import StaffingTab from "../../components/re_staffing/staffingTab";

const ResourcePlanner = () => {
  const [activeTab, setActiveTab] = useState("search");
  const [searchTerm] = useState("");
  const [selectedSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [projects, setProjects] = useState([]);
  const [appliedEmployees, setAppliedEmployees] = useState({});

  const [UnTransformedemployees, setUnTransformedemployees] = useState([]);
  const [UnTransformedprojects, setUnTransformedprojects] = useState([]);
  const [UnTransformedCompletedEmployees, setTransformedCompletedEmployees] =
    useState({});

  // Pagination states for different tabs
  // const [availablePage, setAvailablePage] = useState(1);
  const [, setSearchPage] = useState(1);
  const [proposePage, setProposePage] = useState(1);

  const ITEMS_PER_PAGE = 10;

  // Fetch employees from API
  useEffect(() => {
    const fetchRecords = async () => {
      try {
        setLoading(true);
        await getAllEmployee().then((response) => {
          setEmployees(transformEmployeesForResourcePlanner(response.data));
          setUnTransformedemployees(response.data);
        });

        await GetAllPublishedProject().then((response2) => {
          setProjects(transformProjectDetails(response2));
          setUnTransformedprojects(response2);
        });

        await GetAllApplication().then((response3) => {
          setAppliedEmployees(getAppliedEmployees(response3));
          setTransformedCompletedEmployees(response3);
        });

        await GetAllCompletedApplication().then((response3) => {
          setTransformedCompletedEmployees(response3);
        });
        setError(null);
      } catch (err) {
        console.error("Error fetching employees:", err);
        setError("Failed to load employees. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchRecords();
  }, []);

  // Reset page when changing tabs or filters
  useEffect(() => {
    setSearchPage(1);
  }, [searchTerm, selectedSkills]);

  const { skillGaps, allSkills } = calculateSkillGaps(employees, projects);

  // const filteredEmployees = employees.filter((emp) => {
  //   const matchesSearch =
  //     emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     emp.role.toLowerCase().includes(searchTerm.toLowerCase());
  //   const matchesSkills =
  //     selectedSkills.length === 0 ||
  //     selectedSkills.some((skill) => emp.skills.includes(skill));
  //   return matchesSearch && matchesSkills;
  // });

  // const availableEmployees = filteredEmployees.filter(
  //   (emp) => emp.capacity > 0
  // );

  // Pagination helper function
  const paginateItems = (items, currentPage) => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return items.slice(startIndex, endIndex);
  };

  const proposeEmployee = (employee, project) => {
    alert(`Proposing ${employee.name} for ${project.name}`);
  };

  const handleProposeSuccess = (employee, project) => {
    // Add the employee to the applied list for this project
    setAppliedEmployees((prev) => ({
      ...prev,
      [project.id]: [...(prev[project.id] || []), employee.id],
    }));
  };

  if (loading) {
    return <div className="loading-state">Loading resource planner...</div>;
  }
  return (
    <div className="app-container">
      <div className="app-content">
        {/* Updated Header with UserProfile */}
        <div className="app-header">
          <div className="app-header-content">
            <h1 className="app-title">Resource Planner</h1>
            <p className="app-subtitle">
              Match employees with open project roles
            </p>
          </div>
          <div className="app-header-actions">
            <UserProfile />
          </div>
        </div>
        {/* Navigation Tabs */}
        <div className="nav-container">
          <div className="nav-tabs">
            {[
              // { id: "available", label: "Available Employees", icon: Users },
              { id: "search", label: "Search by Skills", icon: Search },
              { id: "propose", label: "Propose for Projects", icon: UserPlus },
              { id: "gaps", label: "Skill Gap Analysis", icon: TrendingUp },
              { id: "staffing", label: "Staffing Records", icon: FileText },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`nav-tab ${
                  activeTab === tab.id ? "nav-tab-active" : ""
                }`}
              >
                <tab.icon className="nav-tab-icon" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search by Skills */}
        {activeTab === "search" && (
          <EmployeeSearch
            employees={employees} // Array of employee objects
            loading={loading} // Boolean loading state
            error={error} // Error message string or null
            allSkills={allSkills} // Array of all available skills
            ITEMS_PER_PAGE={ITEMS_PER_PAGE} // Number for pagination
            Pagination={Pagination} // Your Pagination component
          />
        )}

        {/* Propose for Projects */}
        {activeTab === "propose" && (
          // Use the exported projects constant
          <ProposeTabContent
            projects={projects} // Use the projects from the artifact
            employees={employees}
            proposePage={proposePage}
            setProposePage={setProposePage}
            proposeEmployee={proposeEmployee}
            appliedEmployees={appliedEmployees}
            onProposeSuccess={handleProposeSuccess}
            ITEMS_PER_PAGE={ITEMS_PER_PAGE}
            paginateItems={paginateItems}
            loading={loading}
          />
        )}

        {activeTab === "gaps" && (
          <SkillGapAnalysis skillGaps={skillGaps} loading={loading} />
        )}

        {/* Staffing Records */}
        {activeTab === "staffing" && (
          <StaffingTab
            projectJson={UnTransformedprojects}
            applicationByProjectId={UnTransformedCompletedEmployees}
            employeeList={UnTransformedemployees}
          />
        )}
      </div>
    </div>
  );
};

export default ResourcePlanner;
