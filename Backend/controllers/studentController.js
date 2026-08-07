const Student = require("../models/studentModel");

// ==========================
// GET ALL STUDENTS
// GET /api/admin/students
// ==========================
const getAllStudents = async (req, res) => {
  try {
    const {
      search = "",
      department = "",
      course = "",
      semester = "",
      status = "",
      page = 1,
      limit = 10,
    } = req.query;

    const result = await Student.getAllStudents(
      search,
      department,
      course,
      semester,
      status,
      Number(page),
      Number(limit)
    );

    res.status(200).json({
      success: true,
      data: result.students,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        totalRecords: result.totalRecords,
        totalPages: result.totalPages,
      },
    });

  } catch (error) {
    console.error("Error fetching students:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch students.",
      error: error.message,
    });
  }
};

// ==========================
// GET STUDENT BY ID
// GET /api/admin/students/:id
// ==========================
const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Student ID is required.",
      });
    }

    const student = await Student.getStudentById(id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: student,
    });

  } catch (error) {
    console.error("Error fetching student:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch student.",
      error: error.message,
    });
  }
};

// ==========================
// GET STUDENT STATS
// GET /api/admin/students/stats
// ==========================
const getStudentStats = async (req, res) => {
  try {
    const stats = await Student.getStudentStats();

    res.status(200).json({
      success: true,
      data: stats,
    });

  } catch (error) {
    console.error("Error fetching student stats:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch student statistics.",
      error: error.message,
    });
  }
};

// ==========================
// CREATE STUDENT
// POST /api/admin/students
// ==========================
const createStudent = async (req, res) => {
  try {
    console.log("Request Body:", req.body);
    const {
      full_name,
      email,
      dob,
      contact_no,
      password,

      enrollment_no,
      department,
      course,
      semester,
      admission_year,
      father_name,
      mother_name,
      guardian_phone,
      address,
      status,
    } = req.body;

    if (
      !full_name ||
      !email ||
      !dob ||
      !contact_no ||
      !password ||
      !enrollment_no ||
      !department ||
      !course ||
      !semester ||
      !admission_year ||
      !father_name ||
      !mother_name ||
      !guardian_phone ||
      !address ||
      !status
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const student = await Student.createStudent({
      full_name,
      email,
      dob,
      contact_no,
      password,

      enrollment_no,
      department,
      course,
      semester,
      admission_year,
      father_name,
      mother_name,
      guardian_phone,
      address,
    });

    res.status(201).json({
      success: true,
      message: "Student created successfully.",
      data: student,
    });

  } catch (error) {
      console.error(error);

  return res.status(500).json({
    success: false,
    message: error.message,
    detail: error.detail,
    code: error.code,
    });
  }
};

// ==========================
// UPDATE STUDENT
// PUT /api/admin/students/:id
// ==========================
const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Student ID is required.",
      });
    }

    const student = await Student.getStudentById(id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found.",
      });
    }

    const updatedStudent = await Student.updateStudent(id, req.body);

    res.status(200).json({
      success: true,
      message: "Student updated successfully.",
      data: updatedStudent,
    });

  } catch (error) {
    console.error("Error updating student:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update student.",
      error: error.message,
    });
  }
};

// ==========================
// DELETE STUDENT
// DELETE /api/admin/students/:id
// ==========================
const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Student ID is required.",
      });
    }

    await Student.deleteStudent(id);

    res.status(200).json({
      success: true,
      message: "Student deleted successfully.",
    });

  } catch (error) {
    console.error("Error deleting student:", error);

    if (error.message === "Student not found") {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to delete student.",
      error: error.message,
    });
  }
};

module.exports = {
  getAllStudents,
  getStudentById,
  getStudentStats,
  createStudent,
  updateStudent,
  deleteStudent,
};