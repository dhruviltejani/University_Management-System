const pool = require("../db")


// ==========================
// GET ALL DEPARTMENTS
// ==========================
const getAllDepartments = async (
  search = "",
  status = "",
  page = 1,
  limit = 10
) => {

  const offset = (page - 1) * limit;

  const whereClause = `
  (
      $1 = ''
      OR department_name ILIKE '%' || $1 || '%'
      OR department_code ILIKE '%' || $1 || '%'
  )

  AND (
      $2 = ''
      OR status = $2
  )
  `;

  const countResult = await pool.query(
    `
    SELECT COUNT(*) AS total
    FROM departments
    WHERE ${whereClause}
    `,
    [search, status]
  );

  const totalRecords = Number(countResult.rows[0].total);

  const result = await pool.query(
    `
    SELECT *
    FROM departments
    WHERE ${whereClause}
    ORDER BY department_name ASC
    LIMIT $3
    OFFSET $4
    `,
    [
      search,
      status,
      limit,
      offset,
    ]
  );

  return {
    departments: result.rows,
    totalRecords,
    totalPages: Math.ceil(totalRecords / limit),
  };
};

// ==========================
// GET DEPARTMENT BY ID
// ==========================
const getDepartmentById = async (id) => {
  const result = await pool.query(
    `
    SELECT *
    FROM departments
    WHERE id = $1
    `,
    [id]
  );

  return result.rows[0];
};

// ==========================
// CREATE DEPARTMENT
// ==========================
const createDepartment = async (departmentData) => {

  const {
    department_name,
    department_code,
    hod_name,
    email,
    phone,
    office_location,
    description,
    status,
  } = departmentData;

  const result = await pool.query(
    `
    INSERT INTO departments
    (
      department_name,
      department_code,
      hod_name,
      email,
      phone,
      office_location,
      description,
      status
    )

    VALUES
    (
      $1,$2,$3,$4,$5,$6,$7,$8
    )

    RETURNING *
    `,
    [
      department_name,
      department_code,
      hod_name,
      email,
      phone,
      office_location,
      description,
      status,
    ]
  );

  return result.rows[0];
};

// ==========================
// UPDATE DEPARTMENT
// ==========================
const updateDepartment = async (id, data) => {

  const {
    department_name,
    department_code,
    hod_name,
    email,
    phone,
    office_location,
    description,
    status,
  } = data;

  const result = await pool.query(
    `
    UPDATE departments

    SET
      department_name = $1,
      department_code = $2,
      hod_name = $3,
      email = $4,
      phone = $5,
      office_location = $6,
      description = $7,
      status = $8

    WHERE id = $9

    RETURNING *
    `,
    [
      department_name,
      department_code,
      hod_name,
      email,
      phone,
      office_location,
      description,
      status,
      id,
    ]
  );

  return result.rows[0];
};

// ==========================
// DELETE DEPARTMENT
// ==========================
const deleteDepartment = async (id) => {

  const result = await pool.query(
    `
    DELETE FROM departments
    WHERE id = $1
    RETURNING *
    `,
    [id]
  );

  if (result.rows.length === 0) {
    throw new Error("Department not found");
  }

  return true;
};

// ==========================
// GET DEPARTMENT STATS
// ==========================
const getDepartmentStats = async () => {

  const result = await pool.query(`
    SELECT

      COUNT(*) AS total_departments,

      COUNT(*) FILTER (
        WHERE status = 'Active'
      ) AS active_departments,

      COUNT(*) FILTER (
        WHERE status = 'Inactive'
      ) AS inactive_departments

    FROM departments
  `);

  return result.rows[0];
};

module.exports = {
  getAllDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  getDepartmentStats,
};