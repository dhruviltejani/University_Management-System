import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sign_up from "./pages/Sign_up";
import Sign_in from "./pages/Sign_in";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
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

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route path="/signin" element={<Sign_in />} />

        <Route path="/signup" element={<Sign_up />} />

        <Route path="/" element={<Sign_in />} />
        
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        <Route path="/reset-password/:token" element={<ProtectedRoute><ResetPassword /></ProtectedRoute>}/>

          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}/>

          <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />

          <Route path="/admin/teachers" element={<ProtectedRoute><Teachers /></ProtectedRoute>} />

          <Route path="/admin/teachers/add" element={<ProtectedRoute><AddTeacher /></ProtectedRoute>} />

          {/* <Route path="/admin/teachers/:id" element={<TeacherProfile />} /> */}

          <Route path="/admin/teachers/edit/:id" element={<ProtectedRoute><EditTeacher /></ProtectedRoute>} />
          <Route path="/admin/teachers/add"element={<ProtectedRoute><AddTeacher /></ProtectedRoute>}/>
          
          <Route path="/admin/departments" element={<ProtectedRoute><Departments /></ProtectedRoute>}/>
          <Route path="/admin/departments/add" element={<ProtectedRoute><AddDepartment /></ProtectedRoute>}/>
          <Route path="/admin/departments/edit/:id" element={<ProtectedRoute><EditDepartment /></ProtectedRoute>}/>

          <Route path="/admin/students" element={<ProtectedRoute><Students /></ProtectedRoute>} />
          <Route path="/admin/students/add" element={<ProtectedRoute><AddStudent /></ProtectedRoute>} />
          <Route path="/admin/students/edit/:id" element={<ProtectedRoute><EditStudent /></ProtectedRoute>} />

          <Route path="/admin/courses" element={<ProtectedRoute><Courses /></ProtectedRoute>} />
          <Route path="/admin/courses/add" element={<ProtectedRoute><AddCourse /></ProtectedRoute>} />
          <Route path="/admin/courses/edit/:id" element={<EditCourse />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;