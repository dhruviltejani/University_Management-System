const express = require("express");
const router = express.Router();

const { getMyLeaves, applyForLeave, deleteMyLeave, getAllLeaves, updateLeaveStatus } = require("../controllers/leaveController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

// Teacher routes
router.get("/my-leaves", verifyToken, getMyLeaves);
router.post("/apply", verifyToken, applyForLeave);
router.delete("/:id", verifyToken, deleteMyLeave);

// Admin routes
router.get("/all", verifyToken, isAdmin, getAllLeaves);
router.put("/:id/status", verifyToken, isAdmin, updateLeaveStatus);

module.exports = router;
