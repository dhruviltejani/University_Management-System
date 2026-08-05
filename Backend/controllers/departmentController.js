const Department = require("../models/departmentModel");

// ==========================
// GET ALL DEPARTMENTS
// GET /api/admin/departments
// ==========================
const getAllDepartments = async (req, res) => {
  try {

    const {
      search = "",
      status = "",
      page = 1,
      limit = 10,
    } = req.query;

    const result = await Department.getAllDepartments(
      search,
      status,
      Number(page),
      Number(limit)
    );

    res.status(200).json({
      success: true,
      data: result.departments,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        totalRecords: result.totalRecords,
        totalPages: result.totalPages,
      },
    });

  } catch (error) {

    console.error("Error fetching departments:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch departments.",
      error: error.message,
    });

  }
};


// ==========================
// GET DEPARTMENT BY ID
// GET /api/admin/departments/:id
// ==========================
const getDepartmentById = async (req, res) => {
  try {

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Department ID is required.",
      });
    }

    const department = await Department.getDepartmentById(id);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: department,
    });

  } catch (error) {

    console.error("Error fetching department:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch department.",
      error: error.message,
    });

  }
};

// ==========================
// CREATE DEPARTMENT
// ==========================
const createDepartment = async (req, res) => {

  try {

    const {
      department_name,
      department_code,
      hod_name,
      email,
      phone,
      office_location,
      description,
      status,
    } = req.body;

    if (
      !department_name ||
      !department_code
    ) {
      return res.status(400).json({
        success: false,
        message: "Department Name and Department Code are required.",
      });
    }

    const department =
      await Department.createDepartment(req.body);

    res.status(201).json({
      success: true,
      message: "Department created successfully.",
      data: department,
    });

  } catch (error) {

    console.error("Create Department Error:", error);

    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to create department.",
    });

  }

};

// ==========================
// UPDATE DEPARTMENT
// PUT /api/admin/departments/:id
// ==========================
const updateDepartment = async (req, res) => {
  try {

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Department ID is required.",
      });
    }

    const department = await Department.getDepartmentById(id);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found.",
      });
    }

    const updatedDepartment = await Department.updateDepartment(
      id,
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Department updated successfully.",
      data: updatedDepartment,
    });

  } catch (error) {

    console.error("Error updating department:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update department.",
      error: error.message,
    });

  }
};

// ==========================
// DELETE DEPARTMENT
// DELETE /api/admin/departments/:id
// ==========================
const deleteDepartment = async (req, res) => {
  try {

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Department ID is required.",
      });
    }

    await Department.deleteDepartment(id);

    res.status(200).json({
      success: true,
      message: "Department deleted successfully.",
    });

  } catch (error) {

    console.error("Error deleting department:", error);

    if (error.message === "Department not found") {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to delete department.",
      error: error.message,
    });

  }
};

// ==========================
// GET DEPARTMENT STATS
// GET /api/admin/departments/stats
// ==========================
const getDepartmentStats = async (req, res) => {
  try {

    const stats = await Department.getDepartmentStats();

    res.status(200).json({
      success: true,
      data: stats,
    });

  } catch (error) {

    console.error("Error fetching department stats:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch department statistics.",
      error: error.message,
    });

  }
};

module.exports = {
  getAllDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  getDepartmentStats,
};