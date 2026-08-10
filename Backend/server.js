require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const teacherRoutes = require("./routes/teacherRoutes");
const departmentRoutes = require("./routes/departmentRoutes");
const studentRoutes = require("./routes/studentRoutes");
const courseRoutes = require("./routes/courseRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Route registration
app.use("/api/auth", authRoutes);
app.use("/api/admin/teachers", teacherRoutes);
app.use("/api/admin/departments", departmentRoutes);
app.use("/api/admin/students", studentRoutes);
app.use("/api/admin/courses", courseRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});