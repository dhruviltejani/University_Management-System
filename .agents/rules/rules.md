---
trigger: always_on
---

# University Management System - Project Context

## Project Overview

This is a full-stack University Management System built with a production-ready architecture. The project is being developed module by module with emphasis on scalability, maintainability, reusable components, clean architecture, and interview-quality code.

The goal is NOT just to make the application work but to build it like a real enterprise software product.

---

# Tech Stack

Frontend
- React.js
- React Router DOM
- Tailwind CSS
- Framer Motion
- Axios
- Lucide React Icons

Backend
- Node.js
- Express.js

Database
- PostgreSQL

Authentication
- JWT Authentication
- Role Based Access (Admin, Teacher, Student)

Password
- bcrypt hashing

---

# Current Project Status

Completed Modules

✔ Authentication
✔ Department Module
✔ Teacher Module
✔ Student Module (CRUD + Statistics + Search + Filters + Pagination)
✔ Course Module (CRUD + Statistics + Search + Filters + Pagination)

Pending Modules

- Dashboard Improvements
- Connect all modules using Foreign Keys
- Validation using Yup
- Image Upload
- Notifications
- Reports

---

# Project Architecture

Frontend

src/

pages/
components/
services/
hooks/
config/
utils/

The project follows reusable component architecture.

Avoid duplicate code.

Always extract reusable logic.

---

Backend Structure

controllers/
models/
routes/
middleware/
db.js

Pattern

Route
↓

Controller

↓

Model

↓

PostgreSQL

Business logic should stay inside Models.

Controllers should remain thin.

---

Database Design

Current Tables

users
departments
teachers
students

Upcoming

courses

Future

subjects
attendance
fees
library
timetable
results

---

Current Database Design

users

Stores

- full_name
- email
- password
- contact_no
- dob
- role

teachers

Stores professional information only.

References users(user_id).

students

Stores academic information only.

References users(user_id).

departments

Independent table.

Courses will later reference departments.

---

Relationships

Teacher

users
|
| user_id
|
teachers

Student

users
|
| user_id
|
students

Future

departments
|
| department_id
|
courses

courses
|
| course_id
|
students

departments
|
| department_id
|
teachers

Currently department and course are stored as strings.

These will later be replaced with Foreign Keys after all CRUD modules are complete.

---

Development Strategy

The project is intentionally developed in two phases.

Phase 1

Complete CRUD for every Admin Module.

Department
Teacher
Student
Course

using temporary string relationships.

Phase 2

Replace string values with foreign keys and connect all modules together.

Do NOT prematurely optimize relationships before CRUD completion.

---

Coding Principles

Always prefer reusable components.

Never duplicate UI.

Prefer configuration-driven components.

Controllers should only validate and call models.

Transactions should be used for multi-table operations.

Always rollback on failure.

Always hash passwords.

Use pagination.

Support filtering.

Support searching.

Support statistics.

Use async/await.

Avoid deeply nested code.

---

Frontend Principles

Every module follows identical architecture.

Example

Teacher

Teacher.jsx

TeacherStats.jsx

TeacherFilters.jsx

TeacherTable.jsx

TeacherForm.jsx

TeacherDetailsModal.jsx (being replaced)

Student

Student.jsx

StudentStats.jsx

StudentFilters.jsx

StudentTable.jsx

StudentForm.jsx

StudentDetailsModal.jsx (being replaced)

Future modules should follow the same architecture.

---

Reusable Component Initiative

The project is currently being refactored to eliminate duplicate code.

Instead of

TeacherDetailsModal

DepartmentDetailsModal

CourseDetailsModal

the project will use

DetailsModal (Already replaced StudentDetailsModal)

which receives

config

and

data

Every module provides only configuration.

The modal should never contain Teacher-specific or Student-specific code.

---

Current Refactoring

Building reusable (COMPLETED)
✔ Avatar
✔ StatusBadge
✔ InfoCard
✔ InfoSection
✔ ModalHeader
✔ DetailsModal
✔ DeleteModal

Configuration files
✔ studentDetailsConfig
✔ teacherDetailsConfig
✔ departmentDetailsConfig
✔ courseDetailsConfig
✔ deleteTeacherConfig
✔ deleteStudentConfig
✔ deleteDepartmentConfig
✔ deleteCourseConfig

---

UI Design

Theme

Modern Admin Dashboard

Rounded Corners

Soft Shadows

Indigo Primary

Minimal Design

Responsive

Consistent spacing

Every component should follow the existing UI language.

---

Code Style

Prefer descriptive variable names.

Keep functions small.

Avoid unnecessary abstraction.

Write readable code.

Avoid magic values.

Prefer constants.

Prefer composition over duplication.

---

Error Handling

Frontend

Show proper alerts/messages.

Backend

Return meaningful HTTP status codes.

Rollback transactions on failure.

Log unexpected errors.

---

Testing Strategy

Every CRUD module must support

Create

Read

Update

Delete

Search

Filter

Pagination

Statistics

Edge case testing

Only after all tests pass should development continue.

---

Future Goals

After CRUD completion

Replace string references with foreign keys.

Implement dynamic dropdowns.

Department dropdown should fetch Departments.

Course dropdown should fetch Courses.

Teacher should reference Department ID.

Student should reference Course ID.

Implement image upload.

Implement Yup validation.

Improve Dashboard.

Add analytics.

---

Instructions for AI Assistant

Always preserve project architecture.

Do not introduce duplicate components.

Suggest reusable abstractions whenever possible.

Do not replace current temporary relationships until instructed.

Prefer enterprise-grade solutions.

Maintain consistency with the existing codebase.

Whenever adding a new module, first check whether an existing reusable component can be extended instead of creating a new one.

Always think about scalability before writing code.

# Do Not

- Do not change folder structure without request.
- Do not rename APIs unless instructed.
- Do not introduce Redux.
- Do not replace PostgreSQL with another database.
- Do not change UI design language.
- Do not remove reusable abstractions.
- Do not change backend architecture (Route → Controller → Model).
- Do not replace current temporary string relationships with foreign keys until the Course module is complete.

