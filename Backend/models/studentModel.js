const pool = require("../db");
const bcrypt = require("bcrypt");

// CRUD

const getAllStudents = async (
  search = "",
  department_id = "",
  course_id = "",
  semester = "",
  status = "",
  class_id = "",
  page = 1,
  limit = 10
) => {

  const offset = (page - 1) * limit;

  const whereClause = `
    u.role = 'student'

    AND (
      $1 = ''
      OR u.full_name ILIKE '%' || $1 || '%'
      OR u.email ILIKE '%' || $1 || '%'
      OR COALESCE(s.enrollment_no,'') ILIKE '%' || $1 || '%'
    )

    AND (
      $2 = ''
      OR s.department_id::text = $2
    )

    AND (
      $3 = ''
      OR s.course_id::text = $3
    )

    AND (
      $4 = ''
      OR s.semester::text = $4
    )

    AND (
      $5 = ''
      OR s.status = $5
    )

    AND (
      $6 = ''
      OR ($6 = 'unassigned' AND s.class_id IS NULL)
      OR ($6 != 'unassigned' AND s.class_id::text = $6)
    )
  `;

  const countResult = await pool.query(
    `
    SELECT COUNT(*) AS total
    FROM users u
    LEFT JOIN students s
      ON u.id = s.user_id
    WHERE ${whereClause}
    `,
    [
      search,
      department_id,
      course_id,
      semester,
      status,
      class_id,
    ]
  );

  const totalRecords = Number(countResult.rows[0].total);

  const result = await pool.query(
    `
    SELECT
      u.id,
      u.full_name,
      u.email,
      u.contact_no,
      u.dob,

      s.enrollment_no,
      s.department_id,
      d.department_name AS department,
      s.course_id,
      c.course_name AS course,
      s.class_id,
      cl.class_name,
      s.semester,
      s.admission_year,
      s.father_name,
      s.mother_name,
      s.guardian_phone,
      s.address,
      s.profile_photo,
      s.status

    FROM users u

    LEFT JOIN students s
      ON u.id = s.user_id
    LEFT JOIN departments d
      ON s.department_id = d.id
    LEFT JOIN courses c
      ON s.course_id = c.id
    LEFT JOIN classes cl
      ON s.class_id = cl.id

    WHERE ${whereClause}

    ORDER BY u.full_name ASC

    LIMIT $7
    OFFSET $8
    `,
    [
      search,
      department_id,
      course_id,
      semester,
      status,
      class_id,
      limit,
      offset,
    ]
  );

  return {
    students: result.rows,
    totalRecords,
    totalPages: Math.ceil(totalRecords / limit),
  };
};

// Get one student
const getStudentById = async (id) => {
  const result = await pool.query(
    `
    SELECT
      u.id,
      u.full_name,
      u.email,
      u.contact_no,
      u.dob,

      s.enrollment_no,
      s.department_id,
      d.department_name AS department,
      s.course_id,
      c.course_name AS course,
      s.class_id,
      cl.class_name,
      s.semester,
      s.admission_year,
      s.father_name,
      s.mother_name,
      s.guardian_phone,
      s.address,
      s.profile_photo,
      s.status

    FROM users u

    JOIN students s
      ON u.id = s.user_id
    LEFT JOIN departments d
      ON s.department_id = d.id
    LEFT JOIN courses c
      ON s.course_id = c.id
    LEFT JOIN classes cl
      ON s.class_id = cl.id

    WHERE u.id = $1
    `,
    [id]
  );

  return result.rows[0];
};

const createStudent = async (studentData) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const {
      full_name,
      email,
      dob,
      contact_no,
      password,

      enrollment_no,
      department_id,
      course_id,
      class_id,
      semester,
      admission_year,
      father_name,
      mother_name,
      guardian_phone,
      address,
      status,
    } = studentData;

    // Validate semester against course's total_semesters
    const courseRes = await client.query(
      `SELECT total_semesters FROM courses WHERE id = $1`,
      [course_id]
    );
    if (courseRes.rows.length > 0) {
      const maxSemesters = courseRes.rows[0].total_semesters;
      if (Number(semester) > Number(maxSemesters)) {
        throw new Error(`Invalid semester. The selected course only has ${maxSemesters} semesters.`);
      }
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert into users table
    const userResult = await client.query(
      `
      INSERT INTO users
      (
        full_name,
        email,
        dob,
        contact_no,
        password,
        role
      )
      VALUES
      ($1,$2,$3,$4,$5,'student')
      RETURNING id
      `,
      [
        full_name,
        email,
        dob,
        contact_no,
        hashedPassword,
      ]
    );

    const userId = userResult.rows[0].id;

    // Insert into students table
    const studentResult = await client.query(
      `
      INSERT INTO students
      (
        user_id,
        enrollment_no,
        department_id,
        course_id,
        class_id,
        semester,
        admission_year,
        father_name,
        mother_name,
        guardian_phone,
        address,
        status
      )
      VALUES
      ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
      RETURNING *
      `,
      [
        userId,
        enrollment_no,
        department_id,
        course_id,
        class_id || null,
        semester,
        admission_year,
        father_name,
        mother_name,
        guardian_phone,
        address,
        status,
      ]
    );

    await client.query("COMMIT");

    return studentResult.rows[0];

  } catch (error) {
    await client.query("ROLLBACK");

    console.error("Student Model Error:", error);

    throw error;
  } finally {
    client.release();
  }
};


// Update student
const updateStudent = async (id, data) => {
  const {
    full_name,
    email,
    contact_no,
    dob,

    enrollment_no,
    department_id,
    course_id,
    class_id,
    semester,
    admission_year,
    father_name,
    mother_name,
    guardian_phone,
    address,
    status,
  } = data;

  // Validate semester against course's total_semesters
  const courseRes = await pool.query(
    `SELECT total_semesters FROM courses WHERE id = $1`,
    [course_id]
  );
  if (courseRes.rows.length > 0) {
    const maxSemesters = courseRes.rows[0].total_semesters;
    if (Number(semester) > Number(maxSemesters)) {
      throw new Error(`Invalid semester. The selected course only has ${maxSemesters} semesters.`);
    }
  }

  // Update users table
  await pool.query(
    `
    UPDATE users
    SET
      full_name = $1,
      email = $2,
      contact_no = $3,
      dob = $4
    WHERE id = $5
    `,
    [
      full_name,
      email,
      contact_no,
      dob,
      id,
    ]
  );

  // Update students table
  const result = await pool.query(
    `
    UPDATE students
    SET
      enrollment_no = $1,
      department_id = $2,
      course_id = $3,
      class_id = $4,
      semester = $5,
      admission_year = $6,
      father_name = $7,
      mother_name = $8,
      guardian_phone = $9,
      address = $10,
      status = $11

    WHERE user_id = $12

    RETURNING *
    `,
    [
      enrollment_no,
      department_id,
      course_id,
      class_id || null,
      semester,
      admission_year,
      father_name,
      mother_name,
      guardian_phone,
      address,
      status,
      id,
    ]
  );

  return result.rows[0];
};

// Delete student
const deleteStudent = async (id) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const result = await client.query(
      `
      SELECT id
      FROM users
      WHERE id = $1
      AND role = 'student'
      `,
      [id]
    );

    if (result.rows.length === 0) {
      throw new Error("Student not found");
    }

    await client.query(
      `
      DELETE FROM students
      WHERE user_id = $1
      `,
      [id]
    );

    await client.query(
      `
      DELETE FROM users
      WHERE id = $1
      `,
      [id]
    );

    await client.query("COMMIT");

    return true;

  } catch (error) {
    await client.query("ROLLBACK");
    throw error;

  } finally {
    client.release();
  }
};

// Dashboard
// Get student statistics
const getStudentStats = async () => {
  // Overall stats
  const result = await pool.query(`
    SELECT
      COUNT(*) AS total_students,

      COUNT(*) FILTER (
        WHERE s.status = 'Active'
      ) AS active_students,

      COUNT(*) FILTER (
        WHERE s.status = 'Inactive'
      ) AS inactive_students,

      COUNT(*) FILTER (
        WHERE s.created_at >= NOW() - INTERVAL '7 days'
      ) AS recent_students,

      COUNT(DISTINCT s.department_id) AS departments

    FROM students s
    JOIN users u
      ON u.id = s.user_id

    WHERE u.role = 'student'
  `);

  // Department Distribution
  const deptDistResult = await pool.query(`
    SELECT 
      d.department_name, 
      COUNT(s.id) as count
    FROM students s
    JOIN departments d ON s.department_id = d.id
    GROUP BY d.department_name
  `);

  // Enrollment Trends (last 12 months)
  const enrollmentTrendsResult = await pool.query(`
    SELECT 
      TO_CHAR(created_at, 'Mon') as month,
      COUNT(id) as count
    FROM students
    WHERE created_at >= NOW() - INTERVAL '12 months'
    GROUP BY TO_CHAR(created_at, 'Mon'), DATE_TRUNC('month', created_at)
    ORDER BY DATE_TRUNC('month', created_at)
  `);

  const stats = result.rows[0];
  stats.department_distribution = deptDistResult.rows;
  stats.enrollment_trends = enrollmentTrendsResult.rows;

  return stats;
};



module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentStats,
};