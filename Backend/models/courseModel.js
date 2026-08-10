const pool = require("../db");

// ==========================
// GET ALL COURSES
// ==========================
const getAllCourses = async (
  search = "",
  department = "",
  status = "",
  page = 1,
  limit = 10
) => {

  const offset = (page - 1) * limit;

  // Reusable WHERE clause
  const whereClause = `
    (
      $1 = ''
      OR course_name ILIKE '%' || $1 || '%'
      OR course_code ILIKE '%' || $1 || '%'
    )

    AND (
      $2 = ''
      OR department = $2
    )

    AND (
      $3 = ''
      OR status = $3
    )
  `;

  // Count query
  const countResult = await pool.query(
    `
    SELECT COUNT(*) AS total
    FROM courses
    WHERE ${whereClause}
    `,
    [
      search,
      department,
      status,
    ]
  );

  const totalRecords = Number(countResult.rows[0].total);

  // Main query
  const result = await pool.query(
    `
    SELECT
      id,
      course_code,
      course_name,
      department,
      duration,
      total_semesters,
      description,
      status,
      created_at,
      updated_at

    FROM courses

    WHERE ${whereClause}

    ORDER BY course_name ASC

    LIMIT $4
    OFFSET $5
    `,
    [
      search,
      department,
      status,
      limit,
      offset,
    ]
  );

  return {
    courses: result.rows,
    totalRecords,
    totalPages: Math.ceil(totalRecords / limit),
  };
};

// ==========================
// GET COURSE BY ID
// ==========================
const getCourseById = async (id) => {
  const result = await pool.query(
    `
    SELECT
      id,
      course_code,
      course_name,
      department,
      duration,
      total_semesters,
      description,
      status,
      created_at,
      updated_at

    FROM courses

    WHERE id = $1
    `,
    [id]
  );

  return result.rows[0];
};

// ==========================
// CREATE COURSE
// ==========================
const createCourse = async (courseData) => {
  const {
    course_code,
    course_name,
    department,
    duration,
    total_semesters,
    description,
    status = "Active",
  } = courseData;

  const result = await pool.query(
    `
    INSERT INTO courses
    (
      course_code,
      course_name,
      department,
      duration,
      total_semesters,
      description,
      status
    )
    VALUES
    ($1,$2,$3,$4,$5,$6,$7)
    RETURNING *
    `,
    [
      course_code,
      course_name,
      department,
      duration,
      total_semesters,
      description,
      status,
    ]
  );

  return result.rows[0];
};

// ==========================
// UPDATE COURSE
// ==========================
const updateCourse = async (id, courseData) => {
  const {
    course_code,
    course_name,
    department,
    duration,
    total_semesters,
    description,
    status,
  } = courseData;

  const result = await pool.query(
    `
    UPDATE courses
    SET
      course_code = $1,
      course_name = $2,
      department = $3,
      duration = $4,
      total_semesters = $5,
      description = $6,
      status = $7,
      updated_at = CURRENT_TIMESTAMP

    WHERE id = $8

    RETURNING *
    `,
    [
      course_code,
      course_name,
      department,
      duration,
      total_semesters,
      description,
      status,
      id,
    ]
  );

  return result.rows[0];
};
// ==========================
// DELETE COURSE
// ==========================
const deleteCourse = async (id) => {

  const result = await pool.query(
    `
    DELETE FROM courses
    WHERE id = $1
    RETURNING *
    `,
    [id]
  );

  return result.rows[0];
};

// ==========================
// COURSE STATISTICS
// ==========================
const getCourseStats = async () => {

  const result = await pool.query(`
    SELECT

      COUNT(*) AS total_courses,

      COUNT(*) FILTER (
        WHERE status = 'Active'
      ) AS active_courses,

      COUNT(*) FILTER (
        WHERE status = 'Inactive'
      ) AS inactive_courses,

      COUNT(DISTINCT department) AS departments

    FROM courses
  `);

  return result.rows[0];
};

module.exports = {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getCourseStats,
};