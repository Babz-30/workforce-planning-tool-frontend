import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import babitha from '../../assets/images/babitha.jpeg';
import senthil from '../../assets/images/senthil.png';
import Sushmita from '../../assets/images/Sushmita.jpg';
import "./TeamContact.css";

const TeamContact = () => {
  const navigate = useNavigate();
  const [selectedMember, setSelectedMember] = useState(null);

  const teamMembers = [
    {
      id: 1,
      name: "Saranya Elumalai",
      role: "Scrum Master",
      image: `${process.env.PUBLIC_URL}/images/member1.jpg`, 
      email: "saranya.elumalai@stud.fra-uas.de",
      description: "Coordinates team efforts and ensures project alignment with agile methodologies.",
      expertise: ["Team Coordination", "Testing", "Documentation"]
    },
    {
      id: 2,
      name: "Pavithran Padmanaban",
      role: "Frontend Developer",
      image: `${process.env.PUBLIC_URL}/images/member1.jpg`,
      description: "Specialized in React and UI/UX development. Passionate about creating intuitive user interfaces.",
      expertise: ["React", "Node.js", "CSS/Tailwind"]
    },
    {
      id: 3,
      name: "Babitha Nadar",
      role: "Frontend Developer",
      email: "babitha.nadar.career@gmail.com",
      image: babitha,
      description: "Full Stack Software Developer Engineer, Specialized in Java and Angular.",
      expertise: ["React", "Cloud", "Springboot",  "MongoDB & MySQL" ]
    },
    {
      id: 4,
      name: "Senthil Arumugam Ramasamy",
      role: "Backend Developer",
      email: "senthilmasters2024@gmail.com",
      image: senthil,
      description: "Passionate Sofware Developer, specialised in backend implementation with different technologies.",
      expertise: ["Java","Angular","Cloud", "SQL & No SQL Database"]
    },
    {
      id: 5,
      name: "Sushmitha Halkurike Pallarappa",
      role: "Backend Developer",
      email:"sushmitha.halkurike-pallarappa@stud.fra-uas.de",
      image: Sushmita,
      description: "Specialized in full stack application development with strong expertise in Java-based backend systems.",
      expertise: ["Java", "Spring Boot", "REST APIs", "MongoDB"]
    }
  ];

  const handleMemberClick = (member) => {
    setSelectedMember(selectedMember?.id === member.id ? null : member);
  };

  return (
    <div className="team-contact-container">
      <div className="team-header">
        <h1>Workforce Planning Tool</h1>
        <p className="team-subtitle">Developed by Team 1a</p>
      </div>

      <div className="project-description">
        <p>
          Welcome to our Workforce Planning Portal, a digital workflow system designed to streamline 
          the internal assignment of employees in large organizations. Our platform supports requesting 
          employees for projects, approval workflows, skill-based matching, and comprehensive tracking 
          for all stakeholders including Project Managers, Department Heads, Resource Planners, and Employees.
        </p>
      </div>

      <div className="team-members-grid">
        {teamMembers.map((member) => (
          <div key={member.id} className="member-card-wrapper">
            <div 
              className={`member-card ${selectedMember?.id === member.id ? 'active' : ''}`}
              onClick={() => handleMemberClick(member)}
            >
              <div className="member-image-container">
                <img 
                  src={member.image} 
                  alt={member.name}
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=4A90E2&color=fff&size=200`;
                  }}
                />
              </div>
              <h3 className="member-name">{member.name}</h3>
              <p className="member-role">{member.role}</p>
              <p className="member-email">{member.email}</p>
            </div>
            
            {selectedMember?.id === member.id && (
              <div className="member-details">
                <p className="member-description">{member.description}</p>
                <div className="member-expertise">
                  <strong>Expertise:</strong>
                  <div className="expertise-tags">
                    {member.expertise.map((skill, index) => (
                      <span key={index} className="expertise-tag">{skill}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="action-buttons">
        <button 
          className="btn-primary" 
          onClick={() => navigate("/")}
        >
          Go to Login
        </button>
      </div>

      <footer className="team-footer">
        <p>Frankfurt University of Applied Sciences | WS 2025/2026</p>
        <p>Agile Development in Cloud Computing Environments</p>
      </footer>
    </div>
  );
};

export default TeamContact;