import axios from "axios";

const API = "http://localhost:5000/api/admin/students";



const getAuthConfig = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Get all students
export const getStudents = async (
  search = "",
  department = "",
  course = "",
  semester = "",
  status = "",
  class_id = "",
  page = 1,
  limit = 10
) => {
  const response = await axios.get(API, {
    ...getAuthConfig(),
    params: {
      search,
      department,
      course,
      semester,
      status,
      class_id,
      page,
      limit,
    },
  });

  return response.data;
};

// Get one student
export const getStudentById = async (id) => {
  const response = await axios.get(
    `${API}/${id}`,
    getAuthConfig()
  );

  return response.data;
};

// Create student
export const createStudent = async (studentData) => {
  const response = await axios.post(
    API,
    studentData,
    getAuthConfig()
  );


  return response.data;
};

// Update student
export const updateStudent = async (id, studentData) => {
  const response = await axios.put(
    `${API}/${id}`,
    studentData,
    getAuthConfig()
  );

  return response.data;
};

// Delete student
export const deleteStudent = async (id) => {
  const response = await axios.delete(
    `${API}/${id}`,
    getAuthConfig()
  );

  return response.data;
};

// Student statistics
export const getStudentStats = async () => {
  const response = await axios.get(
    `${API}/stats`,
    getAuthConfig()
  );

  return response.data;
};
