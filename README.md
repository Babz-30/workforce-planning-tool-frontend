# AI Agent Instructions for Workforce Planning Tool Frontend

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
