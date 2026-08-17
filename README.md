# HealthFusion

HealthFusion is a full-stack nutrition and health tracking web application that helps users create personalized diet plans, record meals, monitor calorie and macronutrient intake, and track progress toward personal health goals.

The application was developed as a Rowan University Senior Project.

---

## Features

HealthFusion currently includes:

- User registration and login
- Secure authentication using JWT and HttpOnly cookies
- Personalized user profiles
- Health goal and activity-level tracking
- Automatic calorie and macronutrient recommendations
- Preset diet plans
- Personalized diet-plan generation
- Diet-plan preview and confirmation
- Food search
- Manual meal entry
- Food-based meal builder
- Breakfast, Lunch, Dinner, and Snack meal types
- Meal editing and deletion
- Meal filtering by date and meal type
- Nutrition goal tracking
- Daily, weekly, and monthly progress views
- Calorie and macronutrient progress visualization
- Weight tracking and weight history
- Current-weight versus target-weight comparison
- Responsive user interface

---

## Technology Stack

### Frontend

- React
- Vite
- JavaScript
- React Router
- HTML
- CSS

### Backend

- Node.js
- Express.js
- JWT authentication
- HttpOnly cookies
- bcryptjs

### Database

- MySQL
- mysql2

---

## Project Structure

```text
HealthFusion/
│
├── frontend/
│   ├── public/
│   │   └── images/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── App.css
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── server.js
│   └── package.json
│
├── database/
│   └── schema.sql
│
├── docs/
│
├── .gitignore
└── README.md
```

---

# Getting Started

## 1. Prerequisites

Before running HealthFusion, install:

- Git
- Node.js and npm
- MySQL Server
- MySQL Workbench or another MySQL client

---

## 2. Clone the Repository

Open PowerShell, Terminal, or Git Bash and run:

```bash
git clone https://github.com/Sobek55/HealthFusion.git
```

Then enter the project:

```bash
cd HealthFusion
```

---

# Database Setup

## 3. Start MySQL

Make sure your local MySQL server is running.

If using MySQL Workbench, connect to your local MySQL instance.

---

## 4. Create the HealthFusion Database

Open:

```text
database/schema.sql
```

Run the entire script in MySQL Workbench.

The script creates the:

```text
healthfusion
```

database and all required tables.

Current tables include:

- `Users`
- `User_Profiles`
- `Nutrition_Goals`
- `Foods`
- `Meals`
- `Meal_Items`
- `Meal_Logs`
- `Diet_Plans`
- `Weight_History`

> Do not repeatedly run the schema against an existing populated database unless you intend to recreate the database.

---

# Backend Setup

## 5. Install Backend Dependencies

From the project root:

```bash
cd backend
npm install
```

---

## 6. Create the Backend Environment File

Inside:

```text
backend/
```

create a file named:

```text
.env
```

Use the following template:

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

Replace:

```text
YOUR_MYSQL_PASSWORD
```

with your local MySQL password.

Replace:

```text
YOUR_PRIVATE_RANDOM_SECRET
```

with a long random secret unique to your local environment.

### Important

Never commit `.env` to GitHub.

The repository `.gitignore` already excludes `.env` files.

Every developer should create their own local `.env`.

---

## 7. Start the Backend

From:

```text
HealthFusion/backend
```

run:

```bash
npm run dev
```

You should see:

```text
HealthFusion API running on port 5000
```

---

## 8. Verify the API and Database

With the backend running, open:

```text
http://localhost:5000/api/health
```

A successful connection should return a response similar to:

```json
{
  "status": "ok",
  "api": "connected",
  "database": "connected",
  "message": "HealthFusion API and database are running"
}
```

If the database shows as disconnected, verify the values in:

```text
backend/.env
```

and confirm that MySQL is running.

---

# Frontend Setup

## 9. Install Frontend Dependencies

Open another terminal.

From the project root:

```bash
cd frontend
npm install
```

---

## 10. Start the Frontend

Run:

```bash
npm run dev
```

Vite will display the local development URL.

Normally:

```text
http://localhost:5173
```

Open that address in your browser.

---

# Running HealthFusion

During development, you should have **two terminals running**.

### Terminal 1 — Backend

```bash
cd backend
npm run dev
```

### Terminal 2 — Frontend

```bash
cd frontend
npm run dev
```

The frontend uses Vite's development proxy to send `/api` requests to:

```text
http://localhost:5000
```

---

# Authentication

HealthFusion uses JWT authentication stored in an **HttpOnly cookie**.

The authentication flow includes:

1. Register an account.
2. Login with the registered email and password.
3. The backend creates the authentication cookie.
4. Protected API routes verify the cookie.
5. Logout removes the authentication session.

Authentication tokens should **not** be stored manually in browser localStorage.

---

# Main Application Pages

## Home

Introduces HealthFusion and demonstrates the application's major features.

## Discover

Allows users to:

- Browse preset diet plans
- View diet-plan details
- Apply a preset diet
- Build a personalized diet plan
- Preview calorie and macro recommendations
- Confirm and save a personalized plan

## Meal Tracking

Allows users to:

- Enter meals manually
- Build meals from foods
- Select a meal type
- Assign a meal date
- Record calories
- Record protein
- Record carbohydrates
- Record fat
- Edit meals
- Delete meals
- Filter meals by date
- Filter meals by type

## User Progress

Displays:

- Calories consumed
- Calories remaining
- Protein consumption
- Carbohydrate consumption
- Fat consumption
- Nutrition targets
- Day progress
- Week progress
- Month progress
- Nutrition charts
- Recent meals
- Weight history
- Current weight
- Target weight
- Difference from target weight

## User Profile

Allows users to manage:

- Age
- Height
- Current weight
- Target weight
- Health goal
- Activity level
- Dietary preferences
- Food restrictions

Changing goal, activity level, or related profile information can recalculate recommended nutrition targets.

---

# API Overview

The backend currently exposes routes under:

```text
/api
```

Major route groups include:

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

Protected user data requires authentication.

---

# Food Builder Note

The Food Builder uses records stored in the:

```text
Foods
```

table.

If a fresh local database contains no food records, the Food Builder search may appear empty.

Manual **Quick Entry** meal creation will still work without food records.

Developers can add food records to the `Foods` table for local testing.

---

# Useful Commands

## Backend

Install packages:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

Start without Nodemon:

```bash
npm start
```

---

## Frontend

Install packages:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

Create production build:

```bash
npm run build
```

Run ESLint:

```bash
npm run lint
```

Preview production build:

```bash
npm run preview
```

---

# Team Git Workflow

Before starting work:

```bash
git pull origin main
```

Check your changes:

```bash
git status
```

Stage your changes:

```bash
git add .
```

Commit:

```bash
git commit -m "Describe your changes"
```

Push:

```bash
git push origin main
```

If multiple people are actively developing at the same time, creating a separate branch is recommended:

```bash
git checkout -b feature/feature-name
```

Then push the branch:

```bash
git push -u origin feature/feature-name
```

Do not use force push on shared project branches.

---

# Files That Should Not Be Committed

Do not commit:

```text
node_modules/
.env
.env.*
dist/
build/
*.log
```

Never place passwords, database credentials, or JWT secrets directly in committed source files.

---

# Troubleshooting

## `npm` or `node` is not recognized

Verify Node.js is installed:

```bash
node --version
npm --version
```

Restart the terminal after installing Node.js.

---

## Backend cannot connect to MySQL

Check:

- MySQL Server is running
- `DB_HOST` is correct
- `DB_USER` is correct
- `DB_PASSWORD` is correct
- `DB_NAME=healthfusion`
- `DB_PORT=3306`

Then restart:

```bash
npm run dev
```

---

## Frontend cannot reach the API

Make sure the backend is running on:

```text
http://localhost:5000
```

and the frontend is running through Vite.

The Vite configuration automatically proxies:

```text
/api
```

to the backend.

---

## Port Already in Use

If port `5000` is already being used, close the process using it before starting the HealthFusion backend.

If port `5173` is already being used, Vite may automatically select another available frontend port.

---

# Current Project Status

HealthFusion currently implements the project's required functional areas:

- Main Page
- Account Registration/Login
- Discover
- Preset Diet Plans
- Personalized Diet Plans
- Meal Entry
- User Progress
- Weight Tracking
- User Profile

The current development phase is focused on **testing, validation, debugging, and final project documentation**.

---

# Repository

```text
https://github.com/Sobek55/HealthFusion
```

---

## HealthFusion

**Plan your nutrition. Track your meals. Measure your progress.**