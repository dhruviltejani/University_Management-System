const Subject = require("../models/subjectModel");

const getAllSubjects = async (req, res) => {
  try {
    const {
      search = "",
      course_id = "",
      teacher_id = "",
      status = "",
      page = 1,
      limit = 10,
    } = req.query;

    const result = await Subject.getAllSubjects(
      search,
      course_id,
      teacher_id,
      status,
      Number(page),
      Number(limit)
    );

    res.status(200).json({
      success: true,
      data: result.subjects,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        totalRecords: result.totalRecords,
        totalPages: result.totalPages,
      },
    });
  } catch (error) {
    console.error("Error fetching subjects:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch subjects.",
      error: error.message,
    });
  }
};

const getSubjectById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Subject ID is required.",
      });
    }

    const subject = await Subject.getSubjectById(id);

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: subject,
    });
  } catch (error) {
    console.error("Error fetching subject:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch subject.",
      error: error.message,
    });
  }
};

const getSubjectStats = async (req, res) => {
  try {
    const stats = await Subject.getSubjectStats();
    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Error fetching subject stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch subject statistics.",
      error: error.message,
    });
  }
};

const createSubject = async (req, res) => {
  try {
    const {
      subject_code,
      subject_name,
      course_id,
      teacher_id,
      semester,
      credits,
      status,
    } = req.body;

    if (!subject_code || !subject_name || !course_id || !semester) {
      return res.status(400).json({
        success: false,
        message: "Subject Code, Name, Course, and Semester are required.",
      });
    }

    const subject = await Subject.createSubject({
      subject_code,
      subject_name,
      course_id,
      teacher_id: teacher_id || null,
      semester,
      credits: credits || 3,
      status: status || "Active",
    });

    res.status(201).json({
      success: true,
      message: "Subject created successfully.",
      data: subject,
    });
  } catch (error) {
    console.error("Create Subject Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create subject.",
    });
  }
};

const updateSubject = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Subject ID is required.",
      });
    }

    const subject = await Subject.getSubjectById(id);

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found.",
      });
    }

    const updatedSubject = await Subject.updateSubject(id, req.body);

    res.status(200).json({
      success: true,
      message: "Subject updated successfully.",
      data: updatedSubject,
    });
  } catch (error) {
    console.error("Error updating subject:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update subject.",
      error: error.message,
    });
  }
};

const deleteSubject = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Subject ID is required.",
      });
    }

    await Subject.deleteSubject(id);

    res.status(200).json({
      success: true,
      message: "Subject deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting subject:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete subject.",
      error: error.message,
    });
  }
};

module.exports = {
  getAllSubjects,
  getSubjectById,
  getSubjectStats,
  createSubject,
  updateSubject,
  deleteSubject,
};
