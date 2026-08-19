const pool = require("../db");

// Get all leaves for a specific user
const getLeavesByUser = async (user_id) => {
  const result = await pool.query(
    "SELECT * FROM leaves WHERE user_id = $1 ORDER BY applied_at DESC",
    [user_id]
  );
  return result.rows;
};

// Count leaves taken in the current year for a specific type
const getAccruedLeaveCount = async (user_id, leave_type) => {
  const result = await pool.query(
    `SELECT COUNT(*) 
     FROM leaves 
     WHERE user_id = $1 
       AND leave_type = $2 
       AND status != 'Rejected'
       AND EXTRACT(YEAR FROM start_date) = EXTRACT(YEAR FROM CURRENT_DATE)`,
    [user_id, leave_type]
  );
  return parseInt(result.rows[0].count);
};

// Apply for a new leave
const applyLeave = async (user_id, leave_type, start_date, end_date, reason, status = 'Pending') => {
  const result = await pool.query(
    `INSERT INTO leaves (user_id, leave_type, start_date, end_date, reason, status) 
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [user_id, leave_type, start_date, end_date, reason, status]
  );
  return result.rows[0];
};

// Delete a leave
const deleteLeave = async (leave_id, user_id) => {
  const result = await pool.query(
    "DELETE FROM leaves WHERE leave_id = $1 AND user_id = $2 RETURNING *",
    [leave_id, user_id]
  );
  return result.rows[0];
};

// --- ADMIN FUNCTIONS ---

// Get all leaves with user details
const getAllLeaves = async () => {
  const result = await pool.query(
    `SELECT 
      l.*, 
      u.full_name, 
      u.role, 
      u.email,
      u.contact_no,
      d.department_name,
      (
        SELECT string_agg(s.subject_name, ', ')
        FROM subject_teachers st
        JOIN subjects s ON st.subject_id = s.id
        WHERE st.teacher_id = t.id
      ) AS subjects,
      (
        SELECT string_agg(DISTINCT c.course_name, ', ')
        FROM subject_teachers st
        JOIN subjects s ON st.subject_id = s.id
        JOIN courses c ON s.course_id = c.id
        WHERE st.teacher_id = t.id
      ) AS courses
     FROM leaves l 
     JOIN users u ON l.user_id = u.id 
     LEFT JOIN teachers t ON u.id = t.user_id
     LEFT JOIN departments d ON t.department_id = d.id
     ORDER BY l.applied_at DESC`
  );
  return result.rows;
};

// Update leave status
const updateLeaveStatus = async (leave_id, status) => {
  const result = await pool.query(
    `UPDATE leaves SET status = $1 WHERE leave_id = $2 RETURNING *`,
    [status, leave_id]
  );
  return result.rows[0];
};

module.exports = {
  getLeavesByUser,
  getAccruedLeaveCount,
  applyLeave,
  getAllLeaves,
  updateLeaveStatus,
  deleteLeave,
};
