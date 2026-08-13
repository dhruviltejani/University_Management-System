import axios from "axios";

const API = "http://localhost:5000/api/admin/departments";

const getAuthConfig = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// ==========================
// GET ALL DEPARTMENTS
// ==========================
export const getDepartments = async (
  search = "",
  status = "",
  page = 1,
  limit = 10
) => {
  const response = await axios.get(API, {
    ...getAuthConfig(),
    params: {
      search,
      status,
      page,
      limit,
    },
  });

  return response.data;
};

// ==========================
// GET ACTIVE DEPARTMENTS (For Dropdowns)
// ==========================
export const getActiveDepartments = async () => {
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
// GET DEPARTMENT BY ID
// ==========================
export const getDepartmentById = async (id) => {
  const response = await axios.get(
    `${API}/${id}`,
    getAuthConfig()
  );

  return response.data;
};

// ==========================
// CREATE DEPARTMENT
// ==========================
export const createDepartment = async (departmentData) => {
  const response = await axios.post(
    API,
    departmentData,
    getAuthConfig()
  );

  return response.data;
};

// ==========================
// UPDATE DEPARTMENT
// ==========================
export const updateDepartment = async (id, data) => {
  const response = await axios.put(
    `${API}/${id}`,
    data,
    getAuthConfig()
  );

  return response.data;
};

// ==========================
// DELETE DEPARTMENT
// ==========================
export const deleteDepartment = async (id) => {
  const response = await axios.delete(
    `${API}/${id}`,
    getAuthConfig()
  );

  return response.data;
};

// ==========================
// GET DEPARTMENT STATS
// ==========================
export const getDepartmentStats = async () => {
  const response = await axios.get(
    `${API}/stats`,
    getAuthConfig()
  );

  return response.data;
};
