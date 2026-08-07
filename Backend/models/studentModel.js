const pool = require("../db");
const bcrypt = require("bcrypt");

// CRUD

const getAllStudents = async (
  search = "",
  department = "",
  course = "",
  semester = "",
  status = "",
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
      OR s.department = $2
    )

    AND (
      $3 = ''
      OR s.course = $3
    )

    AND (
      $4 = ''
      OR s.semester::text = $4
    )

    AND (
      $5 = ''
      OR s.status = $5
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
      department,
      course,
      semester,
      status,
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
      s.department,
      s.course,
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

    WHERE ${whereClause}

    ORDER BY u.full_name ASC

    LIMIT $6
    OFFSET $7
    `,
    [
      search,
      department,
      course,
      semester,
      status,
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
      s.department,
      s.course,
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
      department,
      course,
      semester,
      admission_year,
      father_name,
      mother_name,
      guardian_phone,
      address,
      status,
    } = studentData;

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
        department,
        course,
        semester,
        admission_year,
        father_name,
        mother_name,
        guardian_phone,
        address,
        status
      )
      VALUES
      ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
      RETURNING *
      `,
      [
        userId,
        enrollment_no,
        department,
        course,
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
    department,
    course,
    semester,
    admission_year,
    father_name,
    mother_name,
    guardian_phone,
    address,
    status,
  } = data;

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
      department = $2,
      course = $3,
      semester = $4,
      admission_year = $5,
      father_name = $6,
      mother_name = $7,
      guardian_phone = $8,
      address = $9,
      status = $10

    WHERE user_id = $11

    RETURNING *
    `,
    [
      enrollment_no,
      department,
      course,
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
  const result = await pool.query(`
    SELECT
      COUNT(*) AS total_students,

      COUNT(*) FILTER (
        WHERE s.status = 'Active'
      ) AS active_students,

            COUNT(*) FILTER (
        WHERE s.status = 'Inactive'
      ) AS inactive_students,

      COUNT(DISTINCT s.department) AS departments

      

    FROM students s
    JOIN users u
      ON u.id = s.user_id

    WHERE u.role = 'student'
  `);

  return result.rows[0];
};



module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentStats,
};