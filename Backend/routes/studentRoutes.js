const express = require("express");
const router = express.Router();

const {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentStats,
} = require("../controllers/studentController");

console.log({
  getAllStudents,
  getStudentById,
  getStudentStats,
  createStudent,
  updateStudent,
  deleteStudent,
});

const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

// Statistics
router.get("/stats", verifyToken, isAdmin, getStudentStats);

// CRUD
router.get("/", verifyToken, isAdmin, getAllStudents);

router.get("/:id", verifyToken, isAdmin, getStudentById);

router.post("/", verifyToken, isAdmin, createStudent);

router.put("/:id", verifyToken, isAdmin, updateStudent);

router.delete("/:id", verifyToken, isAdmin, deleteStudent);

module.exports = router;
