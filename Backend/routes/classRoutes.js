const express = require("express");
const router = express.Router();
const classController = require("../controllers/classController");
const { verifyToken } = require("../middleware/authMiddleware");

// Admin routes for Classes
router.get("/", verifyToken, classController.getClasses);
router.post("/", verifyToken, classController.createClass);
router.get("/:id", verifyToken, classController.getClass);
router.put("/:id", verifyToken, classController.updateClass);
router.delete("/:id", verifyToken, classController.deleteClass);
router.post("/:id/assign-students", verifyToken, classController.assignStudents);
router.post("/:id/remove-student/:studentId", verifyToken, classController.removeStudent);

// Teacher route for MFT Classes
// E.g., /api/classes/mft/my-classes
router.get("/mft/my-classes", verifyToken, classController.getMFTClasses);
router.get("/mft/my-classes/:id/students", verifyToken, classController.getMFTClassStudents);

module.exports = router;
