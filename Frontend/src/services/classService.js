import axios from "axios";

const API_URL = "http://localhost:5000/api/admin/classes";
const TEACHER_API_URL = "http://localhost:5000/api/admin/classes";

// Helper to get token
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getClasses = async (search = "", course_id = "", page = 1, limit = 10) => {
  try {
    const params = new URLSearchParams({
      search,
      course_id,
      page,
      limit,
    });

    const response = await axios.get(`${API_URL}?${params.toString()}`, getAuthHeader());
    return {
      data: response.data.classes,
      pagination: {
        totalRecords: response.data.totalRecords,
        totalPages: response.data.totalPages,
      }
    };
  } catch (error) {
    throw error;
  }
};

export const getClassById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`, getAuthHeader());
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createClass = async (classData) => {
  try {
    const response = await axios.post(API_URL, classData, getAuthHeader());
    return {
      success: true,
      data: response.data,
      message: "Class created successfully",
    };
  } catch (error) {
    throw error;
  }
};

export const updateClass = async (id, classData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, classData, getAuthHeader());
    return {
      success: true,
      data: response.data,
      message: "Class updated successfully",
    };
  } catch (error) {
    throw error;
  }
};

export const deleteClass = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, getAuthHeader());
    return {
      success: true,
      message: response.data.message || "Class deleted successfully",
    };
  } catch (error) {
    throw error;
  }
};

export const assignStudents = async (classId, studentIds) => {
  try {
    const response = await axios.post(`${API_URL}/${classId}/assign-students`, { studentIds }, getAuthHeader());
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const removeStudent = async (classId, studentId) => {
  try {
    const response = await axios.post(`${API_URL}/${classId}/remove-student/${studentId}`, {}, getAuthHeader());
    return response.data;
  } catch (error) {
    throw error;
  }
};

// For Teacher Portal
export const getMyMFTClasses = async () => {
  try {
    const response = await axios.get(`${TEACHER_API_URL}/mft/my-classes`, getAuthHeader());
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getMFTClassStudents = async (classId) => {
  try {
    const response = await axios.get(`${TEACHER_API_URL}/mft/my-classes/${classId}/students`, getAuthHeader());
    return response.data;
  } catch (error) {
    throw error;
  }
};
