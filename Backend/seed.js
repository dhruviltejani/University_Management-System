const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const { faker } = require("@faker-js/faker");
require("dotenv").config();

const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "University_data",
  password: String(process.env.DB_PASSWORD || "0000"),
  port: process.env.DB_PORT || 5432,
});

const generateRealisticData = async () => {
  const client = await pool.connect();

  try {
    console.log("Starting dummy data generation...");
    await client.query("BEGIN");

    // 1. Delete existing data (except admin)
    console.log("Clearing existing data...");
    await client.query("DELETE FROM subject_teachers");
    await client.query("DELETE FROM leaves");
    await client.query("DELETE FROM students");
    await client.query("DELETE FROM classes");
    await client.query("DELETE FROM subjects");
    await client.query("DELETE FROM teachers");
    await client.query("DELETE FROM courses");
    await client.query("DELETE FROM departments CASCADE");
    await client.query("DELETE FROM users WHERE role != 'admin'");

    const teacherHash = await bcrypt.hash("Teacher@123", 10);
    const studentHash = await bcrypt.hash("Student@123", 10);

    // Trackers
    let userCount = 0;
    let studentCount = 0;

    // 2. Generate Departments (5)
    console.log("Creating 5 Departments...");
    const departments = [];
    const deptDesignations = ["Engineering", "Science", "Arts", "Business", "Technology"];
    for (let i = 0; i < 5; i++) {
      const deptRes = await client.query(
        `INSERT INTO departments (department_name, department_code, description, status) 
         VALUES ($1, $2, $3, 'Active') RETURNING id`,
        [`Department of ${deptDesignations[i]}`, `DEPT-${deptDesignations[i].substring(0, 3).toUpperCase()}`, faker.lorem.paragraph()]
      );
      departments.push(deptRes.rows[0].id);
    }

    // 3. Generate Courses (2 per dept = 10 total)
    console.log("Creating 10 Courses...");
    const courses = [];
    for (let i = 0; i < departments.length; i++) {
      for (let j = 0; j < 2; j++) {
        const courseRes = await client.query(
          `INSERT INTO courses (course_code, course_name, duration, total_semesters, description, department_id, status)
           VALUES ($1, $2, $3, $4, $5, $6, 'Active') RETURNING id`,
          [`CRS-${departments[i]}-${j}`, faker.company.catchPhrase() + " Degree", 4, 8, faker.lorem.sentences(2), departments[i]]
        );
        courses.push({
          id: courseRes.rows[0].id,
          deptId: departments[i]
        });
      }
    }

    // 4. Generate Teachers (10 per course = 100 total)
    console.log("Creating 100 Teachers...");
    const teachers = [];
    for (let c = 0; c < courses.length; c++) {
      for (let t = 0; t < 10; t++) {
        const isMale = Math.random() > 0.5;
        const fullName = faker.person.fullName({ sex: isMale ? 'male' : 'female' });

        let designation = "Assistant Professor";
        if (t === 0) designation = "HOD";
        else if (t === 1) designation = "Professor";
        else if (t === 2) designation = "Associate Professor";
        else if (t > 7) designation = "Lecturer";

        const email = `teacher${userCount}@univ.edu`;
        userCount++;

        const userRes = await client.query(
          `INSERT INTO users (full_name, email, password, role, dob, contact_no) 
           VALUES ($1, $2, $3, 'teacher', $4, $5) RETURNING id`,
          [fullName, email, teacherHash, faker.date.birthdate({ min: 30, max: 60 }), faker.string.numeric(10)]
        );
        const userId = userRes.rows[0].id;

        const teacherRes = await client.query(
          `INSERT INTO teachers (user_id, employee_id, designation, qualification, specialization, experience_years, office_room, profile_photo, status, gender, department_id)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'Active', $9, $10) RETURNING id, user_id`,
          [userId, `EMP${userCount}`, designation, 'Ph.D', faker.person.jobArea(), faker.number.int({ min: 2, max: 20 }), `Room ${faker.number.int({ min: 100, max: 500 })}`, faker.image.avatar(), isMale ? 'Male' : 'Female', courses[c].deptId]
        );
        teachers.push({
          id: teacherRes.rows[0].id,
          userId: teacherRes.rows[0].user_id,
          courseId: courses[c].id,
          deptId: courses[c].deptId,
          designation
        });
      }
    }

    for (let d = 0; d < departments.length; d++) {
      const hod = teachers.find(t => t.deptId === departments[d] && t.designation === "HOD");
      if (hod) {
        const userRes = await client.query(`SELECT full_name FROM users WHERE id = $1`, [hod.userId]);
        await client.query(`UPDATE departments SET hod_name = $1 WHERE id = $2`, [userRes.rows[0].full_name, departments[d]]);
      }
    }

    // 5. Generate Classes (40 students per class -> 10 classes per course = 100 classes total)
    console.log("Creating 100 Classes...");
    const classes = [];
    for (let c = 0; c < courses.length; c++) {
      for (let cls = 0; cls < 10; cls++) {
        const semester = faker.number.int({ min: 1, max: 8 });
        const courseTeachers = teachers.filter(t => t.courseId === courses[c].id);
        const mft = courseTeachers[cls % courseTeachers.length];

        const classRes = await client.query(
          `INSERT INTO classes (class_name, course_id, semester, division, mft_id)
           VALUES ($1, $2, $3, $4, $5) RETURNING id`,
          [`Class ${c}-${cls}`, courses[c].id, semester, `Div-${String.fromCharCode(65 + (cls % 4))}`, mft.userId]
        );
        classes.push({
          id: classRes.rows[0].id,
          courseId: courses[c].id,
          deptId: courses[c].deptId,
          semester: semester
        });
      }
    }

    // 6. Generate Subjects (4 per semester * 8 semesters = 32 subjects per course)
    console.log("Creating Subjects and Assigning Teachers...");
    const subjects = [];
    for (let c = 0; c < courses.length; c++) {
      for (let sem = 1; sem <= 8; sem++) {
        for (let sub = 0; sub < 4; sub++) {
          const subRes = await client.query(
            `INSERT INTO subjects (subject_code, subject_name, course_id, semester, credits, status)
             VALUES ($1, $2, $3, $4, $5, 'Active') RETURNING id`,
            [`SUB-${c}-${sem}-${sub}`, faker.book.title(), courses[c].id, sem, 3]
          );
          subjects.push(subRes.rows[0].id);

          const courseTeachers = teachers.filter(t => t.courseId === courses[c].id);
          const t1 = courseTeachers[Math.floor(Math.random() * courseTeachers.length)];
          const t2 = courseTeachers[Math.floor(Math.random() * courseTeachers.length)];

          await client.query(
            `INSERT INTO subject_teachers (subject_id, teacher_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
            [subRes.rows[0].id, t1.id]
          );
          if (t1.id !== t2.id) {
            await client.query(
              `INSERT INTO subject_teachers (subject_id, teacher_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
              [subRes.rows[0].id, t2.id]
            );
          }
        }
      }
    }

    // 7. Generate Students (4000 total -> 40 per class)
    console.log("Creating 4000 Students... This will take a moment.");
    for (let cls of classes) {
      for (let s = 0; s < 40; s++) {
        studentCount++;
        const isMale = Math.random() > 0.5;
        const fullName = faker.person.fullName({ sex: isMale ? 'male' : 'female' });
        const email = `student${studentCount}@univ.edu`;

        const dob = faker.date.birthdate({ min: 18, max: 24 });
        const admissionYear = 2024 - Math.floor(cls.semester / 2);

        const userRes = await client.query(
          `INSERT INTO users (full_name, email, password, role, dob, contact_no) 
           VALUES ($1, $2, $3, 'student', $4, $5) RETURNING id`,
          [fullName, email, studentHash, dob, faker.string.numeric(10)]
        );
        const userId = userRes.rows[0].id;

        const enrollNo = `EN2024${studentCount.toString().padStart(4, '0')}`;

        const fatherName = faker.person.fullName({ sex: 'male', lastName: fullName.split(' ').pop() });
        const motherName = faker.person.fullName({ sex: 'female', lastName: fullName.split(' ').pop() });

        await client.query(
          `INSERT INTO students (user_id, enrollment_no, class_id, course_id, department_id, semester, admission_year, father_name, mother_name, guardian_phone, address, profile_photo, status) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 'Active')`,
          [userId, enrollNo, cls.id, cls.courseId, cls.deptId, cls.semester, admissionYear, fatherName, motherName, faker.string.numeric(10), faker.location.streetAddress(), faker.image.avatar()]
        );
      }
    }

    await client.query("COMMIT");
    console.log("✅ Seeding Complete! Seeded 4000 Students, 100 Teachers, 10 Courses, 5 Departments.");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ Seeding failed:", err);
  } finally {
    client.release();
    pool.end();
  }
};

generateRealisticData();
