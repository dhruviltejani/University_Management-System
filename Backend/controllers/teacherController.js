const Teacher = require("../models/teacherModel");

// ==========================
// GET ALL TEACHERS
// GET /api/admin/teachers
// ==========================
const getAllTeachers = async (req, res) => {
  try {
    const {
      search = "",
      department = "",
      designation = "",
      status = "",
      page = 1,
      limit = 10,
    } = req.query;

    const result = await Teacher.getAllTeachers(
      search,
      department,
      designation,
      status,
      Number(page),
      Number(limit)
    );

    res.status(200).json({
      success: true,
      data: result.teachers,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        totalRecords: result.totalRecords,
        totalPages: result.totalPages,
      },
    });

  } catch (error) {
    console.error("Error fetching teachers:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch teachers.",
      error: error.message,
    });
  }
};

// ==========================
// GET TEACHER BY ID
// GET /api/admin/teachers/:id
// ==========================
const getTeacherById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Teacher ID is required.",
      });
    }

    const teacher = await Teacher.getTeacherById(id);

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: teacher,
    });
  } catch (error) {
    console.error("Error fetching teacher:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch teacher.",
      error: error.message,
    });
  }
};


// Create teacher
const createTeacher = async (req, res) => {
  try {
    const {
      full_name,
      email,
      dob,
      contact_no,
      password,
      employee_id,
      department,
      designation,
      qualification,
      experience_years,
      joining_date,
      office_room,
    } = req.body;

    // Basic validation
    if (
      !full_name ||
      !email ||
      !dob ||
      !contact_no ||
      !password ||
      !employee_id ||
      !department ||
      !designation ||
      !qualification ||
      experience_years === undefined ||
      !joining_date ||
      !office_room
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const teacher = await Teacher.createTeacher({
      full_name,
      email,
      dob,
      contact_no,
      password,
      employee_id,
      department,
      designation,
      qualification,
      experience_years,
      joining_date,
      office_room,
    });

    res.status(201).json({
      success: true,
      message: "Teacher created successfully.",
      data: teacher,
    });
  } catch (error) {
    console.error("Create Teacher Error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to create teacher.",
    });
  }
};

// ==========================
// UPDATE TEACHER
// PUT /api/admin/teachers/:id
// ==========================
const updateTeacher = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Teacher ID is required.",
      });
    }
    
    const teacher = await Teacher.getTeacherById(id);

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found.",
      });
    }

    const updatedTeacher = await Teacher.updateTeacher(id, req.body);

    res.status(200).json({
      success: true,
      message: "Teacher updated successfully.",
      data: updatedTeacher,
    });
  } catch (error) {
    console.error("Error updating teacher:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update teacher.",
      error: error.message,
    });
  }
};

// ==========================
// DELETE TEACHER
// DELETE /api/admin/teachers/:id
// ==========================
const deleteTeacher = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Teacher ID is required.",
      });
    }

    await Teacher.deleteTeacher(id);

    res.status(200).json({
      success: true,
      message: "Teacher deleted successfully.",
    });

  } catch (error) {
    console.error("Error deleting teacher:", error);

    if (error.message === "Teacher not found") {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to delete teacher.",
      error: error.message,
    });
  }
};

module.exports = {
  getAllTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher,
};