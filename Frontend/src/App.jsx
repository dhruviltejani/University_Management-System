import { createBrowserRouter, RouterProvider, redirect, Outlet } from "react-router-dom";
import { Toaster } from 'react-hot-toast';

import Sign_up from "./pages/Sign_up";
import Sign_in from "./pages/Sign_in";
import Dashboard from "./pages/Dashboard";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AdminDashboard from "./pages/Admin/Dashboard";
import Teachers from "./pages/Admin/Teachers/Teachers";
import AddTeacher from "./pages/Admin/Teachers/AddTeacher";
import EditTeacher from "./pages/Admin/Teachers/EditTeacher"
import Departments from "./pages/Admin/Departments/Departments";
import AddDepartment from "./pages/Admin/Departments/AddDepartment";
import EditDepartment from "./pages/Admin/Departments/EditDepartment";
import Students from "./pages/Admin/Student/Students";
import AddStudent from "./pages/Admin/Student/AddStudent";
import EditStudent from "./pages/Admin/Student/EditStudent";
import Courses from "./pages/Admin/Course/Course";
import AddCourse from "./pages/Admin/Course/AddCourse";
import EditCourse from "./pages/Admin/Course/EditCourse";

import Subjects from "./pages/Admin/Subjects/Subjects";
import AddSubject from "./pages/Admin/Subjects/AddSubject";
import EditSubject from "./pages/Admin/Subjects/EditSubject";
import AdminLeaves from "./pages/Admin/Leaves/Leaves";

import TeacherDashboard from "./pages/Teacher/Dashboard";
import TeacherClasses from "./pages/Teacher/MyClasses";
import TeacherProfile from "./pages/Teacher/Profile";
import LeaveManagement from "./pages/Teacher/LeaveManagement";

const authLoader = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    return redirect("/signin");
  }
  return null;
};

const router = createBrowserRouter([
  // Public Routes
  { path: "/signin", element: <Sign_in /> },
  { path: "/signup", element: <Sign_up /> },
  { path: "/", element: <Sign_in /> },
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/reset-password/:token", element: <ResetPassword /> },
  
  // Protected Routes
  {
    element: <Outlet />,
    loader: authLoader,
    children: [
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/admin/dashboard", element: <AdminDashboard /> },
      { path: "/admin/teachers", element: <Teachers /> },
      { path: "/admin/teachers/add", element: <AddTeacher /> },
      { path: "/admin/teachers/edit/:id", element: <EditTeacher /> },
      { path: "/admin/departments", element: <Departments /> },
      { path: "/admin/departments/add", element: <AddDepartment /> },
      { path: "/admin/departments/edit/:id", element: <EditDepartment /> },
      { path: "/admin/students", element: <Students /> },
      { path: "/admin/students/add", element: <AddStudent /> },
      { path: "/admin/students/edit/:id", element: <EditStudent /> },
      { path: "/admin/courses", element: <Courses /> },
      { path: "/admin/courses/add", element: <AddCourse /> },
      { path: "/admin/courses/edit/:id", element: <EditCourse /> },
      
      { path: "/admin/subjects", element: <Subjects /> },
      { path: "/admin/subjects/add", element: <AddSubject /> },
      { path: "/admin/subjects/edit/:id", element: <EditSubject /> },
      { path: "/admin/leaves", element: <AdminLeaves /> },
      
      { path: "/teacher/dashboard", element: <TeacherDashboard /> },
      { path: "/teacher/classes", element: <TeacherClasses /> },
      { path: "/teacher/profile", element: <TeacherProfile /> },
      { path: "/teacher/leave", element: <LeaveManagement /> },
    ]
  }
]);


function App() {
  return (
    <>
      <Toaster position="top-right" />
      <RouterProvider router={router} />
    </>
  );
}

export default App;