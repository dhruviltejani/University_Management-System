import axios from "axios";

const API = "http://localhost:5000/api/admin/teachers";

const getAuthConfig = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// ==========================
// GET ALL TEACHERS
// ==========================
export const getTeachers = async (
  search = "",
  department = "",
  designation = "",
  status = "",
  page=1,
  limit = 10
) => {
  const response = await axios.get(API, {
    ...getAuthConfig(),
    params: {
      search,
      department,
      designation,
      status,
      page,
      limit,
    },
  });

  return response.data;
};

// ==========================
// GET TEACHER BY ID
// ==========================
export const getTeacherById = async (id) => {
  const response = await axios.get(
    `${API}/${id}`,
    getAuthConfig()
  );

  return response.data;
};

// ==========================
// UPDATE TEACHER
// ==========================
export const updateTeacher = async (id, data) => {
  const response = await axios.put(
    `${API}/${id}`,
    data,
    getAuthConfig()
  );

  return response.data;
};

// ==========================
// DELETE TEACHER
// ==========================
export const deleteTeacher = async (id) => {
  const response = await axios.delete(
    `${API}/${id}`,
    getAuthConfig()
  );

  return response.data;
};


// ====================
// ADD TEACHER
// ====================

export const createTeacher = async (teacherData) => {
  const response = await axios.post(
    API,
    teacherData,
    getAuthConfig()
  );

  return response.data;
};