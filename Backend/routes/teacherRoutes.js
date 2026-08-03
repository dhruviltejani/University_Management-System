const express = require("express");

const router = express.Router();

const {
  getAllTeachers,
  getTeacherById,
  getTeacherStats,
  createTeacher,
  updateTeacher,
  deleteTeacher,
} = require("../controllers/teacherController");

const authenticateToken = require("../middleware/authMiddleware");

// Get all teachers
router.get("/",authenticateToken,getAllTeachers);

router.get("/stats", getTeacherStats);

// Get one teacher
router.get("/:id",authenticateToken,getTeacherById);

// create teacher
router.post("/", createTeacher);

// Update teacher
router.put("/:id",authenticateToken,updateTeacher);

// Delete teacher
router.delete("/:id",authenticateToken,deleteTeacher);

module.exports = router;