const pool = require("../db");

// Get all classes
const getAllClasses = async (search = "", course_id = "", page = 1, limit = 10) => {
  const offset = (page - 1) * limit;

  const whereClause = `
    ($1 = '' OR c.class_name ILIKE '%' || $1 || '%')
    AND ($2 = '' OR c.course_id::text = $2)
  `;

  const countResult = await pool.query(
    `SELECT COUNT(*) AS total FROM classes c WHERE ${whereClause}`,
    [search, course_id]
  );
  const totalRecords = Number(countResult.rows[0].total);

  const result = await pool.query(
    `
    SELECT 
      c.id, c.class_name, c.semester, c.division,
      c.course_id, co.course_name,
      c.mft_id, u.full_name AS mft_name,
      d.id AS department_id, d.department_name
    FROM classes c
    JOIN courses co ON c.course_id = co.id
    LEFT JOIN departments d ON co.department_id = d.id
    LEFT JOIN teachers t ON c.mft_id = t.user_id
    LEFT JOIN users u ON t.user_id = u.id
    WHERE ${whereClause}
    ORDER BY c.class_name ASC
    LIMIT $3 OFFSET $4
    `,
    [search, course_id, limit, offset]
  );

  return {
    classes: result.rows,
    totalRecords,
    totalPages: Math.ceil(totalRecords / limit),
  };
};

// Get class by ID
const getClassById = async (id) => {
  const result = await pool.query(
    `
    SELECT 
      c.id, c.class_name, c.semester, c.division,
      c.course_id, co.course_name,
      c.mft_id, u.full_name AS mft_name,
      d.id AS department_id, d.department_name
    FROM classes c
    JOIN courses co ON c.course_id = co.id
    LEFT JOIN departments d ON co.department_id = d.id
    LEFT JOIN teachers t ON c.mft_id = t.user_id
    LEFT JOIN users u ON t.user_id = u.id
    WHERE c.id = $1
    `,
    [id]
  );
  return result.rows[0];
};

// Create class
const createClass = async (classData) => {
  const { class_name, course_id, semester, division, mft_id } = classData;

  // Validate if MFT is already assigned to another class in the same semester maybe?
  // Let's just create it.

  const result = await pool.query(
    `
    INSERT INTO classes (class_name, course_id, semester, division, mft_id)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
    `,
    [class_name, course_id, semester, division, mft_id || null]
  );

  return result.rows[0];
};

// Update class
const updateClass = async (id, classData) => {
  const { class_name, course_id, semester, division, mft_id } = classData;

  const result = await pool.query(
    `
    UPDATE classes
    SET class_name = $1, course_id = $2, semester = $3, division = $4, mft_id = $5
    WHERE id = $6
    RETURNING *
    `,
    [class_name, course_id, semester, division, mft_id || null, id]
  );

  return result.rows[0];
};

// Delete class
const deleteClass = async (id) => {
  const result = await pool.query("DELETE FROM classes WHERE id = $1", [id]);
  return result.rowCount > 0;
};

// Get classes by MFT id
const getClassesByMFT = async (mft_id) => {
  const result = await pool.query(
    `
    SELECT 
      c.id, c.class_name, c.semester, c.division,
      c.course_id, co.course_name,
      d.id AS department_id, d.department_name
    FROM classes c
    JOIN courses co ON c.course_id = co.id
    LEFT JOIN departments d ON co.department_id = d.id
    WHERE c.mft_id = $1
    ORDER BY c.class_name ASC
    `,
    [mft_id]
  );
  return result.rows;
};

// Assign students to a class
const assignStudentsToClass = async (class_id, student_user_ids) => {
  // student_user_ids should be an array of user_ids from students table
  if (!student_user_ids || student_user_ids.length === 0) return true;
  
  const result = await pool.query(
    `
    UPDATE students
    SET class_id = $1
    WHERE user_id = ANY($2::int[])
    `,
    [class_id, student_user_ids]
  );
  return result.rowCount > 0;
};

// Remove student from class
const removeStudentFromClass = async (student_user_id) => {
  const result = await pool.query(
    `
    UPDATE students
    SET class_id = NULL
    WHERE user_id = $1
    `,
    [student_user_id]
  );
  return result.rowCount > 0;
};

module.exports = {
  getAllClasses,
  getClassById,
  createClass,
  updateClass,
  deleteClass,
  getClassesByMFT,
  assignStudentsToClass,
  removeStudentFromClass,
};
