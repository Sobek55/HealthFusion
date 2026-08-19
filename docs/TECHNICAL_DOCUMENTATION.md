# HealthFusion Technical Documentation

## Project Information

**Project:** HealthFusion  
**Course:** Rowan University Senior Project  
**Term:** Summer 2026  
**Team Members:** Mrudula Murari, Randy Nunez (SCRUM), Mohammad Rahman, Mohammad Sadman, Charlie Urdaz, Chris Wood

---

## 1. Purpose

HealthFusion is a full-stack nutrition and wellness web application designed to help users create diet plans, record meals, monitor calories and macronutrients, track weight, and review progress toward personal health goals.

The system combines account management, personalized planning, meal tracking, nutrition summaries, and progress visualization in one browser-based application.

---

## 2. Scope

HealthFusion supports the following major functional areas:

- User registration and login
- JWT-based authentication using HttpOnly cookies
- User profile management
- Preset diet plans
- Personalized diet-plan generation
- Meal creation, editing, deletion, and logging
- Food search and food-based meal building
- Calorie and macronutrient tracking
- Daily, weekly, and monthly progress views
- Weight tracking and weight history
- Responsive browser-based user interface

The application is intended for general wellness and nutrition tracking. It is not intended to provide medical diagnosis, treatment, or professional nutritional advice.

---

## 3. System Architecture

HealthFusion uses a client-server architecture with a React frontend, Node.js/Express backend, and MySQL database.

### 3.1 Presentation Layer

The frontend is implemented using:

- React
- Vite
- JavaScript
- React Router
- HTML
- CSS

The presentation layer is responsible for navigation, forms, user input, meal tracking interfaces, profile screens, progress dashboards, and responsive layout behavior.

### 3.2 Application / Controller Layer

The backend is implemented using:

- Node.js
- Express.js
- JavaScript controllers
- REST-style API routes
- JWT authentication
- HttpOnly cookies
- bcryptjs for password hashing

Controllers process requests from the frontend, validate data, apply business logic, and communicate with the database models.

### 3.3 Data Layer

HealthFusion uses MySQL through the `mysql2` package.

The database stores:

- User accounts
- User profiles
- Nutrition goals
- Foods
- Meals
- Meal items
- Meal logs
- Diet plans
- Weight history

### 3.4 Communication Layer

Frontend requests are sent to backend endpoints under `/api`.

During local development, Vite proxies frontend `/api` requests to the backend at:

```text
http://localhost:5000
```

---

## 4. Project Structure

```text
HealthFusion/
|
|-- frontend/
|   |-- public/
|   |-- src/
|   |   |-- components/
|   |   |-- pages/
|   |   |-- services/
|   |   |-- App.jsx
|   |   `-- App.css
|   |-- package.json
|   `-- vite.config.js
|
|-- backend/
|   |-- config/
|   |   `-- db.js
|   |-- controllers/
|   |-- middleware/
|   |-- models/
|   |-- routes/
|   |-- utils/
|   |-- server.js
|   `-- package.json
|
|-- database/
|   |-- schema.sql
|   `-- ugradeFoods.sql
|
|-- docs/
|   `-- TECHNICAL_DOCUMENTATION.md
|
|-- .gitignore
`-- README.md
```

---

## 5. Main Application Pages

### 5.1 Home

The Home page introduces HealthFusion and provides access to the primary public navigation options.

### 5.2 Discover

The Discover page allows users to:

- Browse preset diet plans
- View plan details
- Apply a preset plan
- Build a personalized diet plan
- Preview calorie and macronutrient recommendations
- Confirm and save a personalized plan

### 5.3 Meal Tracking

The Meal Tracking page supports:

- Manual meal entry
- Food-based meal building
- Breakfast, Lunch, Dinner, and Snack meal types
- Meal date selection
- Calorie entry
- Protein entry
- Carbohydrate entry
- Fat entry
- Meal editing
- Meal deletion
- Filtering by date and meal type

### 5.4 User Progress

The User Progress page displays:

- Calories consumed
- Calories remaining
- Protein intake
- Carbohydrate intake
- Fat intake
- Nutrition targets
- Day, week, and month progress views
- Progress visualization
- Recent meals
- Weight history
- Current weight
- Target weight
- Difference from target weight

### 5.5 User Profile

The User Profile page allows users to manage:

- Age
- Height
- Current weight
- Target weight
- Health goal
- Activity level
- Dietary preferences
- Food restrictions

Changes to profile information can affect recommended nutrition targets.

---

## 6. Authentication and Security

HealthFusion uses JWT-based authentication stored in an HttpOnly cookie.

The authentication flow is:

1. User registers an account.
2. User logs in using email and password.
3. The backend verifies credentials.
4. The backend creates an authentication cookie.
5. Protected routes verify the authentication cookie.
6. Logout removes the active authentication session.

Passwords are hashed using bcryptjs before storage.

Environment variables are stored in a local `.env` file and must not be committed to the repository.

---

## 7. Database Configuration

### 7.1 Required Environment Variables

Create `backend/.env` using the following template:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD
DB_NAME=healthfusion
DB_PORT=3306

PORT=5000
JWT_SECRET=YOUR_PRIVATE_RANDOM_SECRET
JWT_EXPIRES_IN=1h
```

### 7.2 Database Initialization

Open and execute:

```text
database/schema.sql
```

The script creates the `healthfusion` database and the required tables.

Important tables include:

- `Users`
- `User_Profiles`
- `Nutrition_Goals`
- `Foods`
- `Meals`
- `Meal_Items`
- `Meal_Logs`
- `Diet_Plans`
- `Weight_History`

---

## 8. API Overview

The backend exposes routes under `/api`.

Primary route groups include:

```text
/api/health
/api/auth
/api/profile
/api/goals
/api/foods
/api/meals
/api/meal-logs
/api/diets
/api/weights
```

Protected user-specific endpoints require authentication.

---

## 9. Local Setup and Run Instructions

### 9.1 Prerequisites

Install:

- Git
- Node.js and npm
- MySQL Server
- MySQL Workbench or another MySQL client

### 9.2 Backend Setup

```bash
cd backend
npm install
npm run dev
```

Expected backend message:

```text
HealthFusion API running on port 5000
```

### 9.3 Frontend Setup

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Vite normally serves the frontend at:

```text
http://localhost:5173
```

### 9.4 Development Runtime

During local development, both frontend and backend processes must be running. MySQL must also be available for database-backed features such as registration, login, meals, profiles, and progress tracking.

---

## 10. Testing and Validation Summary

HealthFusion has been manually tested across major user flows, including:

- Application startup
- Home page loading
- Discover page loading
- Registration required-field validation
- Password mismatch validation
- Valid user registration
- User login
- User profile saving and persistence
- Meal creation
- Meal editing
- Meal deletion
- Meal logging
- User Progress updates from meal data
- Weight recording
- Weight-history persistence
- Weight removal
- Logout
- Protected-route behavior after logout
- End-to-end persistence after logout and login

Frontend testing and end-to-end testing were completed as part of the project testing phase.

---

## 11. Assumptions and Limitations

### Assumptions

- Users have internet access or a working local development environment.
- Users provide accurate meal, weight, and profile information.
- Nutrition calculations depend on the accuracy of stored food and user data.
- Users use a modern browser.

### Limitations

The current release does not include:

- Medical diagnosis or treatment recommendations
- Barcode food scanning
- Image-based food recognition
- Wearable-device integration
- Direct synchronization with third-party health platforms
- Social networking or messaging
- Grocery ordering

The system is intended for general wellness tracking only.

---

## 12. Deployment Considerations

For production use, HealthFusion requires:

- A hosted frontend build
- A hosted Node.js/Express backend
- A hosted MySQL database
- Secure production environment variables
- HTTPS
- Correct production CORS and cookie configuration
- A production API base URL or equivalent routing setup

Production deployment is tracked separately under the project deployment issue.

---

## 13. Roles and Responsibilities

The HealthFusion project team consists of:

- Mrudula Murari
- Randy Nunez (SCRUM)
- Mohammad Rahman
- Mohammad Sadman
- Charlie Urdaz
- Chris Wood

The team collaborated on requirements, development, testing, documentation, and finalization activities through GitHub and project-management workflows.

---

## 14. Terms and Definitions

**API:** Application Programming Interface.  
**JWT:** JSON Web Token used for authentication.  
**REST:** Representational State Transfer; the API communication style used by the application.  
**MySQL:** Relational database management system used by HealthFusion.  
**React:** Frontend JavaScript library used to build the interface.  
**Vite:** Frontend development and build tool.  
**Express.js:** Node.js framework used to implement backend routes and middleware.  
**HttpOnly Cookie:** Browser cookie that JavaScript cannot directly access, used to improve authentication-token security.  
**CRUD:** Create, Read, Update, Delete operations used throughout the application.

---

## 15. Supporting References

- HealthFusion repository `README.md`
- `database/schema.sql`
- Backend configuration in `backend/config/db.js`
- Frontend and backend package definitions
- HealthFusion GitHub Issues and testing records

---

## 16. Revision History

| Version | Date | Description |
|---|---|---|
| 1.0 | Summer 2026 | Initial HealthFusion design and implementation documentation |
| 1.1 | August 2026 | Chapters 1-8 reviewed and formatting updated |
| 1.2 | August 2026 | Final technical documentation completed, including architecture, configuration, API overview, testing summary, deployment considerations, terminology, and revision history |

---

## 17. Current Status

HealthFusion currently implements the main required functional areas:

- Main Page
- Account Registration and Login
- Discover
- Preset Diet Plans
- Personalized Diet Plans
- Meal Entry
- User Progress
- Weight Tracking
- User Profile

The remaining project focus is finalization, production deployment, and final bug/UI review.
