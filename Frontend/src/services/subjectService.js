import axios from "axios";

const API_URL = "http://localhost:5000/api/admin/subjects";

export const getSubjects = async (search = "", course = "", teacher = "", status = "", page = 1, limit = 10) => {
  const token = localStorage.getItem("token");
  const response = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
    params: { search, course_id: course, teacher_id: teacher, status, page, limit },
  });
  return response.data;
};

export const getSubjectById = async (id) => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getSubjectStats = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${API_URL}/stats`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const createSubject = async (subjectData) => {
  const token = localStorage.getItem("token");
  const response = await axios.post(API_URL, subjectData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateSubject = async (id, subjectData) => {
  const token = localStorage.getItem("token");
  const response = await axios.put(`${API_URL}/${id}`, subjectData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteSubject = async (id) => {
  const token = localStorage.getItem("token");
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
