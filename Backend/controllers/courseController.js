const Course = require("../models/courseModel");

// ==========================
// GET ALL COURSES
// GET /api/admin/courses
// ==========================
const getAllCourses = async (req, res) => {
  try {

    const {
      search = "",
      department = "",
      status = "",
      page = 1,
      limit = 10,
    } = req.query;

    const result = await Course.getAllCourses(
      search,
      department,
      status,
      Number(page),
      Number(limit)
    );

    res.status(200).json({
      success: true,
      data: result.courses,

      pagination: {
        page: Number(page),
        limit: Number(limit),
        totalRecords: result.totalRecords,
        totalPages: result.totalPages,
      },
    });

  } catch (error) {

    console.error("Error fetching courses:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch courses.",
      error: error.message,
    });
  }
};

// ==========================
// GET COURSE BY ID
// GET /api/admin/courses/:id
// ==========================
const getCourseById = async (req, res) => {
  try {

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required.",
      });
    }

    const course = await Course.getCourseById(id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: course,
    });

  } catch (error) {

    console.error("Error fetching course:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch course.",
      error: error.message,
    });
  }
};

// ==========================
// GET COURSE STATS
// GET /api/admin/courses/stats
// ==========================
const getCourseStats = async (req, res) => {
  try {

    const stats = await Course.getCourseStats();

    res.status(200).json({
      success: true,
      data: stats,
    });

  } catch (error) {

    console.error("Error fetching course stats:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch course statistics.",
      error: error.message,
    });
  }
};

// ==========================
// CREATE COURSE
// POST /api/admin/courses
// ==========================
const createCourse = async (req, res) => {
  try {

    const {
      course_code,
      course_name,
      department_id,
      duration,
      total_semesters,
      description,
      status,
    } = req.body;

    // Validation
    if (
      !course_code ||
      !course_name ||
      !department_id ||
      duration === undefined ||
      total_semesters === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided.",
      });
    }

    const course = await Course.createCourse({
      course_code,
      course_name,
      department_id,
      duration,
      total_semesters,
      description,
      status,
    });

    res.status(201).json({
      success: true,
      message: "Course created successfully.",
      data: course,
    });

  } catch (error) {

    console.error("Create Course Error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to create course.",
    });
  }
};

// ==========================
// UPDATE COURSE
// PUT /api/admin/courses/:id
// ==========================
const updateCourse = async (req, res) => {
  try {

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required.",
      });
    }

    // Check if course exists
    const existingCourse = await Course.getCourseById(id);

    if (!existingCourse) {
      return res.status(404).json({
        success: false,
        message: "Course not found.",
      });
    }

    const updatedCourse = await Course.updateCourse(id, req.body);

    res.status(200).json({
      success: true,
      message: "Course updated successfully.",
      data: updatedCourse,
    });

  } catch (error) {

    console.error("Error updating course:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update course.",
      error: error.message,
    });
  }
};

// ==========================
// DELETE COURSE
// DELETE /api/admin/courses/:id
// ==========================
const deleteCourse = async (req, res) => {
  try {

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required.",
      });
    }

    const deletedCourse = await Course.deleteCourse(id);

    if (!deletedCourse) {
      return res.status(404).json({
        success: false,
        message: "Course not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Course deleted successfully.",
    });

  } catch (error) {

    console.error("Error deleting course:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete course.",
      error: error.message,
    });
  }
};


module.exports = {
  getAllCourses,
  getCourseById,
  getCourseStats,
  createCourse,
  updateCourse,
  deleteCourse,
};