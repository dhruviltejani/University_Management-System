const { faker } = require('@faker-js/faker');
const pool = require('./db');
const bcrypt = require('bcrypt');

const departmentsData = [
  { name: 'Computer Science and Engineering', code: 'CSE', office: 'Block A, 1st Floor' },
  { name: 'Electrical Engineering', code: 'EE', office: 'Block B, 2nd Floor' },
  { name: 'Mechanical Engineering', code: 'ME', office: 'Block C, 3rd Floor' },
  { name: 'Civil Engineering', code: 'CE', office: 'Block D, 1st Floor' },
  { name: 'Information Technology', code: 'IT', office: 'Block A, 3rd Floor' },
  { name: 'Electronics and Communication', code: 'ECE', office: 'Block B, 1st Floor' },
  { name: 'Business Administration', code: 'BBA', office: 'Block E, 2nd Floor' },
  { name: 'Mathematics and Computing', code: 'MAC', office: 'Block F, 1st Floor' }
];

const seedDatabase = async () => {
  const client = await pool.connect();
  try {
    console.log("Starting data generation...");
    await client.query("BEGIN");

    console.log("Clearing existing data (except admin)...");
    await client.query("DELETE FROM students");
    await client.query("DELETE FROM teachers");
    await client.query("DELETE FROM courses");
    await client.query("DELETE FROM departments");
    await client.query("DELETE FROM users WHERE role != 'admin'");

    const defaultPassword = await bcrypt.hash('password123', 10);

    // 1. Insert Departments
    const deptIds = [];
    for (const dept of departmentsData) {
      const email = faker.internet.email().toLowerCase().slice(0, 50);
      const res = await client.query(
        `INSERT INTO departments (department_name, department_code, office_location, email, phone, status) 
         VALUES ($1, $2, $3, $4, $5, 'Active') RETURNING id`,
        [dept.name, dept.code, dept.office, email, faker.string.numeric(10)]
      );
      deptIds.push({ id: res.rows[0].id, name: dept.name, code: dept.code });
    }
    console.log(`Inserted ${deptIds.length} departments.`);

    // 2. Insert Courses
    const courseIds = [];
    for (const dept of deptIds) {
      // B.Tech
      const btechRes = await client.query(
        `INSERT INTO courses (course_name, course_code, department_id, duration, total_semesters, status)
         VALUES ($1, $2, $3, $4, $5, 'Active') RETURNING id`,
        [`B.Tech in ${dept.name}`, `BT-${dept.code}`, dept.id, 4, 8]
      );
      courseIds.push({ id: btechRes.rows[0].id, deptId: dept.id, sems: 8 });

      // M.Tech or MBA
      const pgPrefix = dept.code === 'BBA' ? 'MBA' : 'M.Tech';
      const pgCode = dept.code === 'BBA' ? `MBA-${dept.code}` : `MT-${dept.code}`;
      const pgRes = await client.query(
        `INSERT INTO courses (course_name, course_code, department_id, duration, total_semesters, status)
         VALUES ($1, $2, $3, $4, $5, 'Active') RETURNING id`,
        [`${pgPrefix} in ${dept.name}`, pgCode, dept.id, 2, 4]
      );
      courseIds.push({ id: pgRes.rows[0].id, deptId: dept.id, sems: 4 });
    }
    console.log(`Inserted ${courseIds.length} courses.`);

    // 3. Insert Teachers (approx 50)
    const teacherCount = 50;
    const designations = ['Professor', 'Associate Professor', 'Assistant Professor', 'Lecturer'];
    const qualifications = ['Ph.D.', 'M.Tech', 'M.Sc.', 'M.A.'];
    let teacherCounter = 1;
    
    // We will track HODs so we can set them in departments later
    const assignedHODs = {}; 

    for (let i = 0; i < teacherCount; i++) {
      const isMale = faker.datatype.boolean();
      const gender = isMale ? 'Male' : 'Female';
      const firstName = faker.person.firstName(isMale ? 'male' : 'female');
      const lastName = faker.person.lastName();
      const fullName = `${firstName} ${lastName}`;
      const email = faker.internet.email({ firstName, lastName }).toLowerCase().slice(0, 50);
      const contactNo = faker.string.numeric(10);
      const dob = faker.date.birthdate({ min: 30, max: 60, mode: 'age' }).toISOString().split('T')[0];
      const joiningDate = faker.date.past({ years: 10 }).toISOString().split('T')[0];
      const dept = deptIds[faker.number.int({ min: 0, max: deptIds.length - 1 })];
      
      let designation = designations[faker.number.int({ min: 0, max: designations.length - 1 })];
      if (!assignedHODs[dept.id]) {
        designation = 'HOD';
        assignedHODs[dept.id] = fullName;
      } else if (designation === 'HOD') {
        designation = 'Professor';
      }

      const qualification = qualifications[faker.number.int({ min: 0, max: qualifications.length - 1 })];
      const exp = faker.number.int({ min: 2, max: 25 });
      const empId = `EMP${1000 + teacherCounter++}`;

      const userRes = await client.query(
        `INSERT INTO users (full_name, email, contact_no, dob, password, role)
         VALUES ($1, $2, $3, $4, $5, 'teacher') RETURNING id`,
        [fullName, email, contactNo, dob, defaultPassword]
      );

      await client.query(
        `INSERT INTO teachers (user_id, employee_id, department_id, designation, qualification, specialization, experience_years, joining_date, gender, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'Active')`,
        [userRes.rows[0].id, empId, dept.id, designation, qualification, faker.lorem.word(), exp, joiningDate, gender]
      );
    }
    
    // Update Departments with HOD
    for (const deptId in assignedHODs) {
      await client.query(`UPDATE departments SET hod_name = $1 WHERE id = $2`, [assignedHODs[deptId], deptId]);
    }
    
    console.log(`Inserted ${teacherCount} teachers.`);

    // 4. Insert Students (approx 400)
    const studentCount = 400;
    let studentCounter = 1;

    for (let i = 0; i < studentCount; i++) {
      const isMale = faker.datatype.boolean();
      const gender = isMale ? 'Male' : 'Female';
      const firstName = faker.person.firstName(isMale ? 'male' : 'female');
      const lastName = faker.person.lastName();
      const fullName = `${firstName} ${lastName}`;
      const email = faker.internet.email({ firstName, lastName }).toLowerCase().slice(0, 50);
      const contactNo = faker.string.numeric(10);
      const dob = faker.date.birthdate({ min: 18, max: 25, mode: 'age' }).toISOString().split('T')[0];
      
      const course = courseIds[faker.number.int({ min: 0, max: courseIds.length - 1 })];
      const semester = faker.number.int({ min: 1, max: course.sems });
      const year = new Date().getFullYear() - Math.floor((semester - 1) / 2);
      
      const enrollNo = `ENR${year}${1000 + studentCounter++}`;
      
      const userRes = await client.query(
        `INSERT INTO users (full_name, email, contact_no, dob, password, role)
         VALUES ($1, $2, $3, $4, $5, 'student') RETURNING id`,
        [fullName, email, contactNo, dob, defaultPassword]
      );

      await client.query(
        `INSERT INTO students (user_id, enrollment_no, department_id, course_id, semester, admission_year, father_name, mother_name, guardian_phone, address, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'Active')`,
        [
          userRes.rows[0].id, enrollNo, course.deptId, course.id, semester, year.toString(),
          faker.person.fullName({ sex: 'male', lastName }).slice(0, 50), faker.person.fullName({ sex: 'female', lastName }).slice(0, 50),
          faker.string.numeric(10), faker.location.streetAddress()
        ]
      );
    }
    console.log(`Inserted ${studentCount} students.`);

    await client.query("COMMIT");
    console.log("Seeding completed successfully!");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error during seeding:", err);
  } finally {
    client.release();
    pool.end();
  }
};

seedDatabase();
