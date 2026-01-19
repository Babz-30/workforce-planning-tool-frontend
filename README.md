# 🏢 Workforce Planning Tool - Frontend

<div align="center">

![React](https://img.shields.io/badge/React-19.0.0-61dafb?style=for-the-badge&logo=react)
![Node](https://img.shields.io/badge/Node.js-LTS-339933?style=for-the-badge&logo=node.js)
![Azure](https://img.shields.io/badge/Azure-Static_Web_Apps-0078D4?style=for-the-badge&logo=microsoft-azure)

**A modern, React-based workforce management solution for streamlining employee assignments and resource planning.**

[Frontend App Url](https://workforce-planning-tool-frontend.onrender.com/) • [Swagger Url](https://workforcemangementtool.onrender.com/swagger-ui/index.html) • [Features](#-features) • [Getting Started](#-getting-started) • [Documentation](#-documentation)

</div>

---

## 📋 Table of Contents

- [About the Project](#-about-the-project)
- [Features](#-features)
- [Getting Started](#-getting-started)
- [Technologies Used](#-technologies-used)
- [Team](#-team)

---

## 🎯 About the Project

The **Workforce Planning Tool** is a comprehensive digital workflow system designed to streamline the internal assignment of employees in large organizations. Built as part of the Agile Development in Cloud Computing Environments course at Frankfurt University of Applied Sciences, this application supports:

- 👥 **Employee Request Management** - Project Managers can request staff for projects
- ✅ **Approval Workflows** - Department Heads review and approve staffing requests
- 🎯 **Skill-Based Matching** - Resource Planners assign suitable employees
- 📊 **Comprehensive Tracking** - Real-time visibility for all stakeholders
- 🔔 **Smart Notifications** - Automated updates for all parties involved

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔐 **Role-Based Access** | Different dashboards for Project Managers, Department Heads, Resource Planners, and Employees |
| 📝 **Request Creation** | Intuitive forms for creating staffing requests with required qualifications |
| 🔄 **Workflow Management** | Complete approval and assignment workflow with status tracking |
| 👤 **Employee Profiles** | Comprehensive skill tracking and availability management |
| 📱 **Responsive Design** | Works seamlessly on desktop, tablet, and mobile devices |
| 🔍 **Advanced Search** | Filter and search employees by skills, availability, and workload |

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (LTS version recommended) - [Download](https://nodejs.org/en)
- **npm** (comes with Node.js) or **yarn**
- **Git** - [Download](https://git-scm.com/)
- A modern web browser (Chrome, Firefox, Safari, or Edge)

**Verify Installation:**

```bash
node -v    # Should display Node.js version (e.g., v18.17.0)
npm -v     # Should display npm version (e.g., 9.6.7)
```

---

### Installation & Setup

#### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/workforce-planning-tool-frontend.git
cd workforce-planning-tool-frontend
```

#### 2️⃣ Install Dependencies

```bash
npm install
```

#### 3️⃣ Configure Environment Variables

Create a `.env` file in the root directory:

```env
REACT_APP_VERSION=1.0.0
REACT_APP_BACKEND_BASE_URL=http://localhost:8080
REACT_APP_USE_MOCK=false
```

#### 4️⃣ Start Development Server

```bash
npm start
```

The application will open automatically at [http://localhost:3000](http://localhost:3000)

---

### Available Scripts

#### Development Mode

```bash
npm start
```
Runs the app in development mode with hot reload.  
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

#### Run Tests

```bash
npm test
```
Launches the test runner in interactive watch mode.  
See [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

#### Production Build

```bash
npm run build
```
Builds the app for production to the `build` folder.  
Optimizes the build for best performance and minifies files.

#### Eject Configuration (⚠️ One-Way Operation)

```bash
npm run eject
```
**Note:** This is a one-way operation. Once you eject, you can't go back!  
Only use if you need full control over the build configuration.

---

### Deployment to Azure

#### Prerequisites for Deployment
- Azure account ([Create free account](https://azure.microsoft.com/free/))
- GitHub account with your code pushed to a repository

#### Step-by-Step Deployment

##### 1️⃣ Push Code to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/your-username/your-repo.git
git push -u origin main
```

##### 2️⃣ Create Azure Static Web App

1. Go to [Azure Portal](https://portal.azure.com)
2. Search for **"Static Web Apps"**
3. Click **"+ Create"**

##### 3️⃣ Configure Settings

| Setting | Value |
|---------|-------|
| **Subscription** | Your Azure subscription |
| **Resource Group** | Create new or use existing |
| **Name** | `workforce-planning-tool` |
| **Hosting Plan** | Free (or Standard for production) |
| **Region** | Choose closest to users |

##### 4️⃣ Connect GitHub

1. Click **"Sign in with GitHub"**
2. Authorize Azure Static Web Apps
3. Select:
   - **Organization:** Your GitHub account
   - **Repository:** `workforce-planning-tool-frontend`
   - **Branch:** `main`

##### 5️⃣ Build Configuration

Set the following build details:

```yaml
App location: /
API location: (leave empty)
Output location: build
```

##### 6️⃣ Deploy

1. Click **"Review + Create"**
2. Click **"Create"**
3. Wait for deployment (2-5 minutes)

##### 7️⃣ Access Your Site

Azure will provide a URL like:
```
https://orange-dune-0f38c1903.3.azurestaticapps.net/
```

#### 🔄 Automatic Updates

Every time you push to GitHub, Azure automatically:
- ✅ Builds your application
- ✅ Runs tests
- ✅ Deploys to production
- ✅ Updates your live site

---

## 🛠 Technologies Used

### Core
- **React 19** - Frontend framework
- **React Router v6** - Client-side routing
- **Create React App** - Build tooling

### UI/UX
- **CSS3** - Custom styling
- **React Toastify** - Toast notifications
- **Responsive Design** - Mobile-first approach

### Development
- **Node.js** - Runtime environment
- **npm** - Package management
- **Git** - Version control

### Deployment
- **Azure Static Web Apps** - Hosting platform
- **GitHub Actions** - CI/CD pipeline

---

## 👥 Team

**Team 1a** - Frankfurt University of Applied Sciences

| Member | Role | Email |
|--------|------|-------|
| Saranya Elumalai | Scrum Master | saranya.elumalai@stud.fra-uas.de |
| Pavithran Padmanaban | Frontend Developer | pavithran.padmanaban@example.com |
| Babitha Nadar | Frontend Developer | babitha.nadar.career@gmail.com |
| Senthil Arumugam Ramasamy | Backend Developer | senthilmasters2024@gmail.com |
| Sushmitha Halkurike Pallarappa | Backend Developer | sushmitha.halkurike-pallarappa@stud.fra-uas.de |

---

## 📚 Learn More

### React Resources
- [React Documentation](https://react.dev/) - Official React docs
- [Create React App Documentation](https://create-react-app.dev/) - CRA guide
- [React Router Documentation](https://reactrouter.com/) - Routing guide

### Azure Resources
- [Azure Static Web Apps Documentation](https://docs.microsoft.com/azure/static-web-apps/)
- [Azure Free Account](https://azure.microsoft.com/free/)

### Project Resources
- [Project Requirements PDF](./docs/adcce_ws25_26_project.pdf)
- [API Documentation](./docs/API.md) _(if available)_

---

## Contributing

This is an academic project. For questions or suggestions, please contact the team members listed above.

---

<div align="center">

Frankfurt University of Applied Sciences | Winter Semester 2025/2026

[⬆ Back to Top](#-workforce-planning-tool---frontend)

</div>
