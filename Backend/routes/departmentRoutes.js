const express = require("express");
const router = express.Router();

const {
  getAllDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  getDepartmentStats,
} = require("../controllers/departmentController");

const authenticateToken = require("../middleware/authMiddleware");
// ==========================
// GET ALL DEPARTMENTS
// ==========================
router.get("/",authenticateToken,getAllDepartments);

// ==========================
// GET DEPARTMENT STATS
// ==========================
router.get("/stats", authenticateToken, getDepartmentStats);

// ==========================
// GET DEPARTMENT BY ID
// ==========================
router.get("/:id", authenticateToken, getDepartmentById);

// ==========================
// CREATE DEPARTMENT
// ==========================
router.post("/", authenticateToken, createDepartment);

// ==========================
// UPDATE DEPARTMENT
// ==========================
router.put("/:id", authenticateToken, updateDepartment);

// ==========================
// DELETE DEPARTMENT
// ==========================
router.delete("/:id", authenticateToken, deleteDepartment);
module.exports = router;