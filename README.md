# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

---
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
