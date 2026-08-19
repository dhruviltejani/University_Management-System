const express = require("express");
const router = express.Router();

const {
  getAllSubjects,
  getSubjectById,
  getSubjectStats,
  createSubject,
  updateSubject,
  deleteSubject,
} = require("../controllers/subjectController");

const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

// Statistics
router.get("/stats", verifyToken, isAdmin, getSubjectStats);

// Get all subjects
router.get("/", verifyToken, isAdmin, getAllSubjects);

// Get one subject
router.get("/:id", verifyToken, isAdmin, getSubjectById);

// Create subject
router.post("/", verifyToken, isAdmin, createSubject);

// Update subject
router.put("/:id", verifyToken, isAdmin, updateSubject);

// Delete subject
router.delete("/:id", verifyToken, isAdmin, deleteSubject);

module.exports = router;
