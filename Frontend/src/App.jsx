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

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route path="/signin" element={<Sign_in />} />

        <Route path="/signup" element={<Sign_up />} />

        <Route path="/" element={<Sign_in />} />
        
        <Route path="/forgot-password" element={<ForgotPassword />} />

        
        <Route path="/reset-password/:token" element={<ResetPassword />}/>

          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}/>

          <Route path="/admin/dashboard" element={<AdminDashboard />} />

          <Route path="/admin/teachers" element={<Teachers />} />

          <Route path="/admin/teachers/add" element={<AddTeacher />} />

          {/* <Route path="/admin/teachers/:id" element={<TeacherProfile />} /> */}

          <Route path="/admin/teachers/edit/:id" element={<EditTeacher />} />
          <Route path="/admin/teachers/add"element={<ProtectedRoute><AddTeacher /></ProtectedRoute>}/>
          
          <Route path="/admin/departments" element={<Departments />}/>
          <Route path="/admin/departments/add" element={<AddDepartment />}/>
          <Route path="/admin/departments/edit/:id" element={<EditDepartment />}/>

          <Route path="/admin/students" element={<Students />} />
          <Route path="/admin/students/add" element={<AddStudent />} />
          <Route path="/admin/students/edit/:id" element={<EditStudent />} />

      </Routes>

    </BrowserRouter>
  );
}

export default App;