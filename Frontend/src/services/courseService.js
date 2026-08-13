import axios from "axios";

const API = "http://localhost:5000/api/admin/courses";

// ==========================
// AUTH HEADER
// ==========================
const getAuthConfig = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// ==========================
// GET ALL COURSES
// ==========================
export const getCourses = async (
  search = "",
  department = "",
  status = "",
  page = 1,
  limit = 10
) => {
  const response = await axios.get(API, {
    ...getAuthConfig(),
    params: {
      search,
      department,
      status,
      page,
      limit,
    },
  });

  return response.data;
};

// ==========================
// GET ACTIVE COURSES (For Dropdowns)
// ==========================
export const getActiveCourses = async () => {
  const response = await axios.get(API, {
    ...getAuthConfig(),
    params: {
      status: "Active",
      limit: 1000,
    },
  });

  return response.data;
};

// ==========================
// GET COURSE BY ID
// ==========================
export const getCourseById = async (id) => {
  const response = await axios.get(
    `${API}/${id}`,
    getAuthConfig()
  );

  return response.data;
};

// ==========================
// CREATE COURSE
// ==========================
export const createCourse = async (courseData) => {
  const response = await axios.post(
    API,
    courseData,
    getAuthConfig()
  );

  return response.data;
};

// ==========================
// UPDATE COURSE
// ==========================
export const updateCourse = async (id, courseData) => {
  const response = await axios.put(
    `${API}/${id}`,
    courseData,
    getAuthConfig()
  );

  return response.data;
};

// ==========================
// DELETE COURSE
// ==========================
export const deleteCourse = async (id) => {
  const response = await axios.delete(
    `${API}/${id}`,
    getAuthConfig()
  );

  return response.data;
};

// ==========================
// COURSE STATISTICS
// ==========================
export const getCourseStats = async () => {
  const response = await axios.get(
    `${API}/stats`,
    getAuthConfig()
  );

  return response.data;
};