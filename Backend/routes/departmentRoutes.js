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

const {verifyToken , isAdmin} = require("../middleware/authMiddleware");
// ==========================
// GET ALL DEPARTMENTS
// ==========================
router.get("/",verifyToken ,isAdmin ,getAllDepartments);

// ==========================
// GET DEPARTMENT STATS
// ==========================
router.get("/stats",verifyToken , isAdmin , getDepartmentStats);

// ==========================
// GET DEPARTMENT BY ID
// ==========================
router.get("/:id", verifyToken , isAdmin , getDepartmentById);

// ==========================
// CREATE DEPARTMENT
// ==========================
router.post("/", verifyToken , isAdmin , createDepartment);

// ==========================
// UPDATE DEPARTMENT
// ==========================
router.put("/:id", verifyToken , isAdmin , updateDepartment);

// ==========================
// DELETE DEPARTMENT
// ==========================
router.delete("/:id", verifyToken , isAdmin , deleteDepartment);
module.exports = router;