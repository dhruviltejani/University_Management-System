const express = require("express");

const router = express.Router();

const {
  getAllCourses,
  getCourseById,
  getCourseStats,
  createCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/courseController");

const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

// ==========================
// GET COURSE STATS
// GET /api/admin/courses/stats
// ==========================
router.get("/stats", verifyToken, isAdmin, getCourseStats);

// ==========================
// GET ALL COURSES
// GET /api/admin/courses
// ==========================
router.get("/", verifyToken, isAdmin, getAllCourses);

// ==========================
// GET COURSE BY ID
// GET /api/admin/courses/:id
// ==========================
router.get("/:id", verifyToken, isAdmin, getCourseById);

// ==========================
// CREATE COURSE
// POST /api/admin/courses
// ==========================
router.post("/", verifyToken, isAdmin, createCourse);

// ==========================
// UPDATE COURSE
// PUT /api/admin/courses/:id
// ==========================
router.put("/:id", verifyToken, isAdmin, updateCourse);

// ==========================
// DELETE COURSE
// DELETE /api/admin/courses/:id
// ==========================
router.delete("/:id", verifyToken, isAdmin, deleteCourse);

module.exports = router;