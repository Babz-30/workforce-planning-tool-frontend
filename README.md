Workforce Planning Tool Frontend

## Project Overview

This is a React-based frontend application for workforce planning, built with Create React App. The project uses modern React (v19) and follows standard React application patterns.

## Project Structure

- `/src`: Main source code directory
  - `App.js`: Main application component
  - Components should be placed in `/src/components` (create as needed)
  - Styles in `/src/styles` or co-located with components
  - Tests co-located with components using `.test.js` suffix

## Development Workflow

1. Development server: `npm start` (runs on http://localhost:3000)
2. Testing: `npm test` (Jest + React Testing Library)
3. Production build: `npm run build`

## Key Technologies & Versions

- React: ^19.2.0
- Testing Libraries:
  - @testing-library/react: ^16.3.0
  - @testing-library/jest-dom: ^6.9.1
  - @testing-library/dom: ^10.4.1

## Testing Conventions

- Use React Testing Library for component testing
- Co-locate test files with components
- Follow Testing Library's user-centric testing philosophy
- Example test pattern:

```javascript
import { render, screen } from "@testing-library/react";
import Component from "./Component";

test("renders component", () => {
  render(<Component />);
  expect(screen.getByText(/expected text/i)).toBeInTheDocument();
});
```

## Project-Specific Guidelines

1. Keep components focused and single-responsibility
2. Use functional components with hooks
3. Follow React 19 best practices and patterns
4. Maintain responsive design considerations

## Build & Deployment

- Production builds are generated in the `/build` directory
- Assets are automatically optimized and hashed
- Static files should be placed in `/public`

## Key Integration Points

1. Add backend API endpoints and services in `/src/services`
2. Environment variables should be prefixed with `REACT_APP_`
3. Define API interfaces before implementation

Please request feedback or clarification on any unclear sections of these instructions.

# 🚀 How to Deploy a Static Web Page on Azure

This guide shows you how to put your HTML, CSS, and JS website online using **Azure Static Web Apps**.

---

## 🧰 What You Need

- A **GitHub account**
- An **Azure account** (free tier works fine)
- A simple website folder (with files like `index.html`, `style.css`, etc.)

---

## 🪜 Steps to Deploy

### 1. **Put Your Code on GitHub**

1. Go to [https://github.com](https://github.com).
2. Create a **new repository** (for example: `my-static-site`).
3. Upload your website files (HTML, CSS, JS).

---

### 2. **Go to Azure Portal**

1. Visit [https://portal.azure.com](https://portal.azure.com).
2. Search for **Static Web Apps**.
3. Click **Create**.

---

### 3. **Fill in the Basics**

- **Subscription:** Choose your Azure subscription.
- **Resource Group:** Create a new one or use an existing one.
- **Name:** Give your app a unique name (example: `my-awesome-site`).
- **Hosting Plan:** Choose **Free** for now.
- **Region:** Pick one close to your users.

Click **Next: Deployment Details** ➡️

---

### 4. **Connect to GitHub**

1. Click **Sign in with GitHub**.
2. Choose your repository and branch (usually `main`).
3. For **Build Presets**, choose **Custom** (if it’s just HTML/CSS/JS).
4. Set:
   - **App location:** `/`
   - **Output location:** `/`

Then click **Review + Create**, and finally **Create**.

---

### 5. **Wait for Deployment**

Azure will:

- Automatically create a **GitHub Action** workflow.
- Build and deploy your site.
- Give you a **live URL** (something like `https://orange-sand-0a1234e00.1.azurestaticapps.net`).

---

### 6. **Done **

Visit your site using the provided URL.  
Each time you **push changes to GitHub**, Azure will **auto-update** your site.

---
