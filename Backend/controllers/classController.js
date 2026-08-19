const classModel = require("../models/classModel");

// Get all classes
const getClasses = async (req, res) => {
  try {
    const { search, course_id, page, limit } = req.query;
    const result = await classModel.getAllClasses(
      search,
      course_id,
      parseInt(page) || 1,
      parseInt(limit) || 10
    );
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching classes:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get class by ID
const getClass = async (req, res) => {
  try {
    const { id } = req.params;
    const classData = await classModel.getClassById(id);
    if (!classData) {
      return res.status(404).json({ error: "Class not found" });
    }
    res.status(200).json(classData);
  } catch (error) {
    console.error("Error fetching class:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Create class
const createClass = async (req, res) => {
  try {
    const { mft_id } = req.body;
    if (mft_id) {
      const existingClass = await classModel.getClassesByMFT(mft_id);
      if (existingClass.length > 0) {
        return res.status(400).json({ error: "This teacher is already assigned as an MFT to another class." });
      }
    }

    const newClass = await classModel.createClass(req.body);
    res.status(201).json(newClass);
  } catch (error) {
    console.error("Error creating class:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update class
const updateClass = async (req, res) => {
  try {
    const { id } = req.params;
    const { mft_id } = req.body;
    
    if (mft_id) {
      const existingClass = await classModel.getClassesByMFT(mft_id);
      const isAssignedToOther = existingClass.some(
        (cls) => cls.id !== parseInt(id) && cls.id !== id
      );
      if (isAssignedToOther) {
        return res.status(400).json({ error: "This teacher is already assigned as an MFT to another class." });
      }
    }

    const updatedClass = await classModel.updateClass(id, req.body);
    if (!updatedClass) {
      return res.status(404).json({ error: "Class not found" });
    }
    res.status(200).json(updatedClass);
  } catch (error) {
    console.error("Error updating class:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete class
const deleteClass = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await classModel.deleteClass(id);
    if (!deleted) {
      return res.status(404).json({ error: "Class not found" });
    }
    res.status(200).json({ message: "Class deleted successfully" });
  } catch (error) {
    console.error("Error deleting class:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get classes assigned to a specific MFT (Teacher)
const getMFTClasses = async (req, res) => {
  try {
    const mft_id = req.user.id; // From auth middleware
    const classes = await classModel.getClassesByMFT(mft_id);
    res.status(200).json(classes);
  } catch (error) {
    console.error("Error fetching MFT classes:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Assign students to class
const assignStudents = async (req, res) => {
  try {
    const { id } = req.params;
    const { studentIds } = req.body;
    
    if (!studentIds || !Array.isArray(studentIds)) {
      return res.status(400).json({ error: "studentIds array is required" });
    }

    await classModel.assignStudentsToClass(id, studentIds);
    res.status(200).json({ message: "Students assigned successfully" });
  } catch (error) {
    console.error("Error assigning students:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Remove student from class
const removeStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    await classModel.removeStudentFromClass(studentId);
    res.status(200).json({ message: "Student removed successfully" });
  } catch (error) {
    console.error("Error removing student:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get students for an MFT class
const getMFTClassStudents = async (req, res) => {
  try {
    const { id } = req.params;
    const mft_id = req.user.id;
    
    const classData = await classModel.getClassById(id);
    if (!classData || classData.mft_id !== mft_id) {
      return res.status(403).json({ error: "Unauthorized or Class not found" });
    }

    const studentModel = require("../models/studentModel");
    const result = await studentModel.getAllStudents("", "", "", "", "Active", id, 1, 1000);
    
    res.status(200).json(result.students);
  } catch (error) {
    console.error("Error fetching MFT class students:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getClasses,
  getClass,
  createClass,
  updateClass,
  deleteClass,
  getMFTClasses,
  assignStudents,
  removeStudent,
  getMFTClassStudents
};
