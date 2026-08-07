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

const {verifyToken , isAdmin} = require("../middleware/authMiddleware");

// Statistics
router.get("/stats", verifyToken, isAdmin, getTeacherStats);

// Get all teachers
router.get("/", verifyToken, isAdmin, getAllTeachers);

// Get one teacher
router.get("/:id", verifyToken, isAdmin, getTeacherById);

// Create teacher
router.post("/", verifyToken, isAdmin, createTeacher);

// Update teacher
router.put("/:id", verifyToken, isAdmin, updateTeacher);

// Delete teacher
router.delete("/:id", verifyToken, isAdmin, deleteTeacher);

module.exports = router;