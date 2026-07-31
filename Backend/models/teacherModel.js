const pool = require("../db");
const bcrypt = require("bcrypt");

// Get all teachers

const getAllTeachers = async (
  search = "",
  department = "",
  designation = "",
  status = "",
  page = 1,
  limit = 10
) => {

  const offset = (page - 1) * limit;

  const whereClause = `
    u.role = 'teacher'

    AND (
      $1 = ''
      OR u.full_name ILIKE '%' || $1 || '%'
      OR u.email ILIKE '%' || $1 || '%'
      OR COALESCE(t.employee_id,'') ILIKE '%' || $1 || '%'
    )

    AND (
      $2 = ''
      OR t.department = $2
    )

    AND (
      $3 = ''
      OR t.designation = $3
    )

    AND (
      $4 = ''
      OR t.status = $4
    )
  `;

  // Total records
  const countResult = await pool.query(
    `
    SELECT COUNT(*) AS total
    FROM users u
    LEFT JOIN teachers t
      ON u.id = t.user_id
    WHERE ${whereClause}
    `,
    [search, department, designation, status]
  );

  const totalRecords = Number(countResult.rows[0].total);

  // Current page data
  const result = await pool.query(
    `
    SELECT
      u.id,
      u.full_name,
      u.email,
      u.contact_no,
      u.dob,
      t.employee_id,
      t.department,
      t.designation,
      t.qualification,
      t.specialization,
      t.gender,
      t.experience_years,
      t.joining_date,
      t.office_room,
      t.profile_photo,
      t.status

    FROM users u

    LEFT JOIN teachers t
      ON u.id = t.user_id

    WHERE ${whereClause}

    ORDER BY u.full_name ASC

    LIMIT $5
    OFFSET $6
    `,
    [
      search,
      department,
      designation,
      status,
      limit,
      offset,
    ]
  );

  return {
    teachers: result.rows,
    totalRecords,
    totalPages: Math.ceil(totalRecords / limit),
  };
};

// Get one teacher
const getTeacherById = async (id) => {
  const result = await pool.query(
    `
    SELECT
      u.id,
      u.full_name,
      u.email,
      u.contact_no,
      u.dob,

      t.employee_id,
      t.department,
      t.designation,
      t.qualification,
      t.specialization,
      t.gender,
      t.experience_years,
      t.joining_date,
      t.office_room,
      t.profile_photo,
      t.status

    FROM users u
    JOIN teachers t
      ON u.id=t.user_id

    WHERE u.id=$1
    `,
    [id]
  );

  return result.rows[0];
};

// Update teacher
const updateTeacher = async (id, data) => {
  const {
    full_name,
    email,
    contact_no,
    dob,

    employee_id,
    department,
    designation,
    qualification,
    specialization,
    gender,
    experience_years,
    joining_date,
    office_room,
    status,
  } = data;

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

  const result = await pool.query(
    `
    UPDATE teachers
    SET
      employee_id = $1,
      department = $2,
      designation = $3,
      qualification = $4,
      specialization = $5,
      gender = $6,
      experience_years = $7,
      joining_date = $8,
      office_room = $9,
      status = $10

    WHERE user_id = $11

    RETURNING *
    `,
    [
      employee_id,
      department,
      designation,
      qualification,
      specialization,
      gender,
      experience_years,
      joining_date,
      office_room,
      status,
      id,
    ]
  );

  return result.rows[0];
};


// Delete teacher
const deleteTeacher = async (id) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const result = await client.query(
      `SELECT id FROM users WHERE id = $1 AND role = 'teacher'`,
      [id]
    );

    if (result.rows.length === 0) {
      throw new Error("Teacher not found");
    }

    await client.query(
      "DELETE FROM teachers WHERE user_id = $1",
      [id]
    );

    await client.query(
      "DELETE FROM users WHERE id = $1",
      [id]
    );

    await client.query("COMMIT");

    return true;

  } catch (err) {
    await client.query("ROLLBACK");
    throw err;

  } finally {
    client.release();
  }
};

const createTeacher = async (teacherData) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const {
      full_name,
      email,
      dob,
      contact_no,
      gender,
      password,
      employee_id,
      department,
      designation,
      qualification,
      specialization,
      experience_years,
      joining_date,
      office_room,
    } = teacherData;

    // Hash password
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
      ($1,$2,$3,$4,$5,'teacher')
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

    // Insert into teachers table
    const teacherResult = await client.query(
      `
      INSERT INTO teachers
      (
        user_id,
        employee_id,
        department,
        designation,
        qualification,
        specialization,
        experience_years,
        joining_date,
        office_room,
        gender
      )
      VALUES
      ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING *
      `,
      [
        userId,
        employee_id,
        department,
        designation,
        qualification,
        specialization,
        experience_years,
        joining_date,
        office_room,
        gender,
      ]
    );

    await client.query("COMMIT");

    return teacherResult.rows[0];

  } 
 catch (error) {
  await client.query("ROLLBACK");
  throw error;
 }
  finally {

    client.release();

  }
};

module.exports = {
  getAllTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher,
};
