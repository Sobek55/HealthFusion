# HealthFusion Frontend

A React-based web application for nutrition tracking and health goal management. The frontend provides users with an intuitive interface to log meals, track nutritional intake, manage dietary goals, and monitor weight progress.

## Features

- **User Authentication** — Register, log in, and password recovery
- **Profile Management** — Set up personal health profile with age, height, weight, activity level, and dietary preferences
- **Nutrition Goals** — Define daily calorie and macronutrient (protein, carbs, fat) targets
- **Meal Logging** — Search for foods and log meals with quantities
- **Nutrition Dashboard** — View daily intake summary and progress toward nutrition goals
- **Health Tracking** — Monitor weight history and adjust goals based on progress
- **Goal Discovery** — Browse pre-built health plans and nutrition recommendations

## Technologies

- **React 19** — UI library
- **React Router DOM 7** — Client-side routing
- **Vite** — Build tool and dev server
- **ESLint** — Code linting

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend server running (typically on `http://localhost:5000`)

## Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Running Locally

Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173` by default. The page will hot-reload when you make code changes.

## Available Scripts

- `npm run dev` — Start development server with hot module replacement
- `npm run build` — Build for production to the `dist` folder
- `npm run lint` — Run ESLint to check code quality
- `npm run preview` — Preview the production build locally

## Frontend Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.jsx      # Navigation header
│   └── ProtectedRoute.jsx  # Route guard for authenticated pages
├── pages/               # Page components
│   ├── Dashboard.jsx    # Home dashboard
│   ├── Profile.jsx      # User profile settings
│   ├── Goals.jsx        # Nutrition goals
│   ├── Meals.jsx        # Meal logging
│   ├── Discover.jsx     # Browse health plans
│   ├── Login.jsx        # Login page
│   ├── Register.jsx     # Registration page
│   ├── ForgotPassword.jsx  # Password recovery
│   └── ResetPassword.jsx   # Password reset
├── services/
│   └── api.js           # API client for backend communication
├── App.jsx              # Root app component
├── App.css              # Global styles
├── main.jsx             # Entry point
└── index.css            # Base styles
```

## Development Notes

- The frontend connects to the backend API at the base URL specified in `src/services/api.js`
- Authentication tokens are managed through the API service
- CSS is organized with global styles in `App.css` and page-specific styles where appropriate
- Components are protected with `ProtectedRoute` to ensure only authenticated users can access them

