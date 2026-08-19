const pool = require("../db");

// ==========================
// GET ALL SUBJECTS
// ==========================
const getAllSubjects = async (
  search = "",
  course_id = "",
  teacher_id = "",
  status = "",
  page = 1,
  limit = 10
) => {
  const offset = (page - 1) * limit;

  // Reusable WHERE clause
  const whereClause = `
    (
      $1 = ''
      OR s.subject_name ILIKE '%' || $1 || '%'
      OR s.subject_code ILIKE '%' || $1 || '%'
    )
    AND (
      $2 = ''
      OR s.course_id::text = $2
    )
    AND (
      $3 = ''
      OR EXISTS (
        SELECT 1 FROM subject_teachers st2
        JOIN teachers t2 ON st2.teacher_id = t2.id
        WHERE st2.subject_id = s.id AND t2.user_id::text = $3
      )
    )
    AND (
      $4 = ''
      OR s.status = $4
    )
  `;

  // Count query
  const countResult = await pool.query(
    `
    SELECT COUNT(DISTINCT s.id) AS total
    FROM subjects s
    WHERE ${whereClause}
    `,
    [search, course_id, teacher_id, status]
  );

  const totalRecords = Number(countResult.rows[0].total);

  // Main query
  const result = await pool.query(
    `
    SELECT
      s.id,
      s.subject_code,
      s.subject_name,
      s.course_id,
      c.course_name AS course,
      s.semester,
      s.credits,
      s.status,
      s.created_at,
      s.updated_at,
      COALESCE(
        json_agg(
          json_build_object(
            'id', t.user_id, 
            'name', u.full_name,
            'employee_id', t.employee_id,
            'department', d.department_name
          )
        ) FILTER (WHERE t.id IS NOT NULL), 
        '[]'
      ) AS teachers
    FROM subjects s
    LEFT JOIN courses c ON s.course_id = c.id
    LEFT JOIN subject_teachers st ON s.id = st.subject_id
    LEFT JOIN teachers t ON st.teacher_id = t.id
    LEFT JOIN users u ON t.user_id = u.id
    LEFT JOIN departments d ON t.department_id = d.id
    WHERE ${whereClause}
    GROUP BY s.id, c.course_name
    ORDER BY s.subject_name ASC
    LIMIT $5 OFFSET $6
    `,
    [search, course_id, teacher_id, status, limit, offset]
  );

  return {
    subjects: result.rows,
    totalRecords,
    totalPages: Math.ceil(totalRecords / limit),
  };
};

// ==========================
// GET SUBJECT BY ID
// ==========================
const getSubjectById = async (id) => {
  const result = await pool.query(
    `
    SELECT
      s.id,
      s.subject_code,
      s.subject_name,
      s.course_id,
      c.course_name AS course,
      s.semester,
      s.credits,
      s.status,
      s.created_at,
      s.updated_at,
      COALESCE(
        json_agg(
          json_build_object(
            'id', t.user_id, 
            'name', u.full_name,
            'employee_id', t.employee_id,
            'department', d.department_name
          )
        ) FILTER (WHERE t.id IS NOT NULL), 
        '[]'
      ) AS teachers
    FROM subjects s
    LEFT JOIN courses c ON s.course_id = c.id
    LEFT JOIN subject_teachers st ON s.id = st.subject_id
    LEFT JOIN teachers t ON st.teacher_id = t.id
    LEFT JOIN users u ON t.user_id = u.id
    LEFT JOIN departments d ON t.department_id = d.id
    WHERE s.id = $1
    GROUP BY s.id, c.course_name
    `,
    [id]
  );

  return result.rows[0];
};

// ==========================
// CREATE SUBJECT
// ==========================
const createSubject = async (subjectData) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const {
      subject_code,
      subject_name,
      course_id,
      teacher_ids = [],
      semester,
      credits,
      status = "Active",
    } = subjectData;

    const result = await client.query(
      `
      INSERT INTO subjects
      (subject_code, subject_name, course_id, semester, credits, status)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
      `,
      [subject_code, subject_name, course_id, semester, credits, status]
    );

    const subject = result.rows[0];

    // Assign teachers
    if (Array.isArray(teacher_ids) && teacher_ids.length > 0) {
      for (const tId of teacher_ids) {
        if (tId) {
          await client.query(
            `
            INSERT INTO subject_teachers (subject_id, teacher_id)
            SELECT $1, id FROM teachers WHERE user_id = $2
            `,
            [subject.id, tId]
          );
        }
      }
    }

    await client.query("COMMIT");
    return subject;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

// ==========================
// UPDATE SUBJECT
// ==========================
const updateSubject = async (id, subjectData) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const {
      subject_code,
      subject_name,
      course_id,
      teacher_ids = [],
      semester,
      credits,
      status,
    } = subjectData;

    const result = await client.query(
      `
      UPDATE subjects
      SET
        subject_code = $1,
        subject_name = $2,
        course_id = $3,
        semester = $4,
        credits = $5,
        status = $6,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $7
      RETURNING *
      `,
      [subject_code, subject_name, course_id, semester, credits, status, id]
    );

    const subject = result.rows[0];

    // Delete existing teachers
    await client.query(`DELETE FROM subject_teachers WHERE subject_id = $1`, [id]);

    // Insert new teachers
    if (Array.isArray(teacher_ids) && teacher_ids.length > 0) {
      for (const tId of teacher_ids) {
        if (tId) {
          await client.query(
            `
            INSERT INTO subject_teachers (subject_id, teacher_id)
            SELECT $1, id FROM teachers WHERE user_id = $2
            `,
            [id, tId]
          );
        }
      }
    }

    await client.query("COMMIT");
    return subject;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

// ==========================
// DELETE SUBJECT
// ==========================
const deleteSubject = async (id) => {
  const result = await pool.query(
    `
    DELETE FROM subjects
    WHERE id = $1
    RETURNING *
    `,
    [id]
  );
  return result.rows[0];
};

// ==========================
// SUBJECT STATISTICS
// ==========================
const getSubjectStats = async () => {
  const result = await pool.query(`
    SELECT
      COUNT(*) AS total_subjects,
      COUNT(*) FILTER (WHERE status = 'Active') AS active_subjects,
      COUNT(*) FILTER (WHERE status = 'Inactive') AS inactive_subjects,
      COUNT(DISTINCT course_id) AS total_courses
    FROM subjects
  `);

  return result.rows[0];
};

module.exports = {
  getAllSubjects,
  getSubjectById,
  createSubject,
  updateSubject,
  deleteSubject,
  getSubjectStats,
};
