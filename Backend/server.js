require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const teacherRoutes = require("./routes/teacherRoutes");
const departmentRoutes = require("./routes/departmentRoutes");
const studentRoutes = require("./routes/studentRoutes");
const courseRoutes = require("./routes/courseRoutes");
const subjectRoutes = require("./routes/subjectRoutes");
const leaveRoutes = require("./routes/leaveRoutes");
const classRoutes = require("./routes/classRoutes");

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
  process.env.FRONTEND_URL?.replace(/\/$/, '')
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());

// Route registration
app.use("/api/auth", authRoutes);
app.use("/api/admin/teachers", teacherRoutes);
app.use("/api/admin/departments", departmentRoutes);
app.use("/api/admin/students", studentRoutes);
app.use("/api/admin/courses", courseRoutes);
app.use("/api/admin/subjects", subjectRoutes);
app.use("/api/admin/classes", classRoutes);
app.use("/api/leaves", leaveRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});