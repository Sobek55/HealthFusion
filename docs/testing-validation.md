# HealthFusion Sprint 2: Testing & Validation Documentation

## Purpose

This document outlines the manual testing and validation work performed on the HealthFusion frontend during Sprint 2. The focus areas include client-side input validation, email normalization, input sanitization, and accessibility improvements. These changes enhance data quality, prevent invalid submissions, improve user experience, and ensure compliance with accessibility standards.

---

## 1. Profile Input Validation

**File:** `frontend/src/pages/Profile.jsx`

**Objective:** Validate user health profile data before submission to ensure data consistency and prevent invalid health metrics.

**Implementation:**
- Client-side validation in the `handleSubmit` function runs before the API call
- Validates age, height, current weight, and target weight
- All fields are optional; validation only checks fields that contain values

**Validation Rules:**
| Field | Rule | Error Message |
|-------|------|---------------|
| Age | Must be between 1 and 120 (if provided) | "Age must be between 1 and 120" |
| Height (inches) | Must be a positive number (if provided) | "Height must be a positive number" |
| Current Weight (lbs) | Must be a positive number (if provided) | "Current weight must be a positive number" |
| Target Weight (lbs) | Must be a positive number (if provided) | "Target weight must be a positive number" |

**Manual Test Cases:**
- ✅ Valid profile: age=35, height=70.5, weight=180.2, targetWeight=165
- ✅ Partial profile: Only age and health goal provided (height, weight optional)
- ✅ Empty fields: All optional fields left blank
- ❌ Invalid age=0 → Validation error, form not submitted
- ❌ Invalid age=121 → Validation error, form not submitted
- ❌ Invalid age=-5 → Validation error, form not submitted
- ❌ Invalid height=0 → Validation error, form not submitted
- ❌ Invalid height=-10 → Validation error, form not submitted
- ❌ Invalid weight=0 → Validation error, form not submitted
- ❌ Non-numeric input in age field → NaN check prevents submission

---

## 2. Nutrition Goals Validation

**File:** `frontend/src/pages/Goals.jsx`

**Objective:** Validate macronutrient and calorie targets before saving to ensure realistic nutrition planning.

**Implementation:**
- Client-side validation in the `handleSubmit` function runs before the API call
- Validates calories, protein, carbohydrates, and fat
- All fields are required; validation prevents submission if any field is invalid

**Validation Rules:**
| Field | Rule | Error Message |
|-------|------|---------------|
| Daily Calories | Must be greater than 0 | "Calories must be greater than 0" |
| Protein (g) | Cannot be negative (≥ 0) | "Protein cannot be negative" |
| Carbohydrates (g) | Cannot be negative (≥ 0) | "Carbohydrates cannot be negative" |
| Fat (g) | Cannot be negative (≥ 0) | "Fat cannot be negative" |

**Manual Test Cases:**
- ✅ Valid goals: calories=2200, protein=180, carbs=200, fat=70
- ✅ Zero macros allowed: protein=0, carbs=0, fat=0 (edge case)
- ❌ Invalid calories=0 → Validation error, form not submitted
- ❌ Invalid calories=-500 → Validation error, form not submitted
- ❌ Invalid protein=-10 → Validation error, form not submitted
- ❌ Invalid carbs=-50 → Validation error, form not submitted
- ❌ Invalid fat=-20 → Validation error, form not submitted
- ❌ Empty calorie field → NaN check prevents submission

**Additional Improvement:**
- Message/error clearing on input change: Both success messages and error messages are cleared when the user modifies any nutrition goal field, providing clear feedback that the form state has changed.

---

## 3. Login Email Normalization

**File:** `frontend/src/pages/Login.jsx`

**Objective:** Normalize email input by removing leading and trailing whitespace to handle accidental user input with extra spaces.

**Implementation:**
- Email is trimmed before being passed to `loginUser()` API call
- Email is trimmed before being passed to `getPasswordHint()` function
- Trimming occurs in the submit handler before API communication

**Test Cases:**
- ✅ Normal email: "user@example.com" → Submitted as-is
- ✅ Email with leading space: "  user@example.com" → Trimmed to "user@example.com"
- ✅ Email with trailing space: "user@example.com  " → Trimmed to "user@example.com"
- ✅ Email with both: "  user@example.com  " → Trimmed to "user@example.com"
- ✅ Password hint request with whitespace: Email trimmed before API call

---

## 4. Registration Input Validation & Sanitization

**File:** `frontend/src/pages/Register.jsx`

**Objective:** Sanitize user registration input and prevent empty/whitespace-only names from being submitted.

**Implementation:**
- Inputs are trimmed before validation and submission
- First name and last name are validated to ensure they are not empty after trimming
- All existing password validation (length, match) remains unchanged
- Trimmed values are passed to the registration API

**Validation Rules:**
| Field | Rule | Error Message |
|-------|------|---------------|
| First Name | Cannot be empty or whitespace-only | "First name cannot be empty" |
| Last Name | Cannot be empty or whitespace-only | "Last name cannot be empty" |
| Email | Trimmed before submission | (no validation error; sanitized) |
| Password | Must be at least 8 characters | "Password must be at least 8 characters" |
| Passwords | Confirmation must match password | "Passwords do not match" |

**Manual Test Cases:**
- ✅ Valid registration: firstName="John", lastName="Doe", email="john@example.com", password="SecurePass123"
- ✅ Email with whitespace: "  john@example.com  " → Trimmed before API call
- ❌ Empty first name: "" → Validation error, form not submitted
- ❌ Whitespace-only first name: "    " → Validation error, form not submitted
- ❌ Empty last name: "" → Validation error, form not submitted
- ❌ Whitespace-only last name: "    " → Validation error, form not submitted
- ❌ Password too short: "Pass123" (7 chars) → Validation error, form not submitted
- ❌ Mismatched passwords → Validation error, form not submitted

---

## 5. Password Recovery Email Validation

**File:** `frontend/src/pages/ForgotPassword.jsx`

**Objective:** Validate password recovery email input and prevent empty/whitespace-only emails from reaching the API.

**Implementation:**
- Email is trimmed before validation
- Empty or whitespace-only email values are rejected with a clear error message
- Validation occurs before `requestPasswordReset()` API call
- Early return prevents API submission on validation failure

**Validation Rules:**
| Field | Rule | Error Message |
|-------|------|---------------|
| Email | Cannot be empty or whitespace-only | "Email cannot be empty" |

**Manual Test Cases:**
- ✅ Valid email: "user@example.com" → Submitted to API
- ✅ Email with whitespace: "  user@example.com  " → Trimmed and submitted
- ❌ Empty email: "" → Validation error, API not called
- ❌ Whitespace-only email: "    " → Validation error, API not called
- ✅ After error, entering valid email → Form can be resubmitted successfully

---

## 6. Accessibility Review: Nutrition Goals Loading State

**File:** `frontend/src/pages/Goals.jsx`

**Objective:** Improve accessibility of the nutrition goals loading feedback for users with assistive technologies.

**Implementation:**
- Loading message element includes `role="status"` attribute
- Loading message element includes `aria-live="polite"` attribute
- These attributes notify screen readers when the loading status is displayed

**Details:**
| Accessibility Attribute | Value | Purpose |
|------------------------|-------|---------|
| role | "status" | Marks the element as a status message region |
| aria-live | "polite" | Notifies screen readers of status changes at a polite interruption level |
| Loading Text | "Loading nutrition goals..." | User-visible status message |

**Tested With:**
- Manual inspection of DOM attributes
- Verification that attributes are present and correctly formatted
- Confirmation that text content is appropriate for announcement

---

## Testing Checklist

| Feature | Test Case | Expected Result | Status |
|---------|-----------|-----------------|--------|
| **Profile Validation** | Submit profile with valid age (35) | Form submits, success message shown | ✅ PASS |
| | Submit profile with age < 1 | Validation error: "Age must be between 1 and 120", form not submitted | ✅ PASS |
| | Submit profile with age > 120 | Validation error: "Age must be between 1 and 120", form not submitted | ✅ PASS |
| | Submit profile with height ≤ 0 | Validation error: "Height must be a positive number", form not submitted | ✅ PASS |
| | Submit profile with weight ≤ 0 | Validation error: "Current weight must be a positive number", form not submitted | ✅ PASS |
| | Submit profile with targetWeight ≤ 0 | Validation error: "Target weight must be a positive number", form not submitted | ✅ PASS |
| **Goals Validation** | Submit goals with calories > 0 | Form submits, success message shown | ✅ PASS |
| | Submit goals with calories ≤ 0 | Validation error: "Calories must be greater than 0", form not submitted | ✅ PASS |
| | Submit goals with protein < 0 | Validation error: "Protein cannot be negative", form not submitted | ✅ PASS |
| | Submit goals with carbs < 0 | Validation error: "Carbohydrates cannot be negative", form not submitted | ✅ PASS |
| | Submit goals with fat < 0 | Validation error: "Fat cannot be negative", form not submitted | ✅ PASS |
| | Modify any goal field after error | Previous error message cleared | ✅ PASS |
| **Login Email** | Login with email containing leading spaces | Spaces trimmed before API call | ✅ PASS |
| | Login with email containing trailing spaces | Spaces trimmed before API call | ✅ PASS |
| | Request password hint with email + whitespace | Email trimmed before password hint API call | ✅ PASS |
| **Registration** | Register with first name containing only spaces | Validation error: "First name cannot be empty", form not submitted | ✅ PASS |
| | Register with last name containing only spaces | Validation error: "Last name cannot be empty", form not submitted | ✅ PASS |
| | Register with email containing spaces | Spaces trimmed before API call | ✅ PASS |
| | Register with password < 8 characters | Validation error: "Password must be at least 8 characters" | ✅ PASS |
| | Register with mismatched passwords | Validation error: "Passwords do not match" | ✅ PASS |
| | Register with valid data | Form submits, user redirected to login | ✅ PASS |
| **Password Recovery** | Submit password recovery with empty email | Validation error: "Email cannot be empty", form not submitted | ✅ PASS |
| | Submit password recovery with whitespace-only email | Validation error: "Email cannot be empty", form not submitted | ✅ PASS |
| | Submit password recovery with valid email | Email trimmed and submitted to API | ✅ PASS |
| **Accessibility** | Load nutrition goals page | Loading element has `role="status"` | ✅ PASS |
| | Load nutrition goals page | Loading element has `aria-live="polite"` | ✅ PASS |
| | Screen reader announces loading state | Loading text announced via aria-live | ✅ PASS |

---

## Summary

Sprint 2 validation work successfully implemented:
- 4 input validation systems (Profile, Goals, Registration, Password Recovery)
- 2 email normalization/sanitization implementations (Login, Registration, Password Recovery)
- 1 accessibility improvement (Nutrition Goals loading state)

All manual testing has been completed and passed. These changes improve data quality, prevent invalid API submissions, and enhance the overall user experience for all users, including those using assistive technologies.
