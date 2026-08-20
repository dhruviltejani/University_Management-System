/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  // Users Table
  pgm.createTable('users', {
    id: 'id', // serial primary key
    full_name: { type: 'varchar(100)' },
    email: { type: 'varchar(100)', unique: true },
    dob: { type: 'date' },
    contact_no: { type: 'varchar(15)' },
    password: { type: 'varchar(255)' },
    reset_token: { type: 'text' },
    reset_token_expiry: { type: 'timestamp' },
    role: { type: 'varchar(20)', notNull: true, default: 'student' }
  });

  // Departments Table
  pgm.createTable('departments', {
    id: 'id',
    department_name: { type: 'varchar(100)', notNull: true, unique: true },
    department_code: { type: 'varchar(20)', notNull: true, unique: true },
    hod_name: { type: 'varchar(100)' },
    email: { type: 'varchar(100)' },
    phone: { type: 'varchar(20)' },
    office_location: { type: 'varchar(100)' },
    description: { type: 'text' },
    status: { type: 'varchar(20)', default: 'Active' },
    created_at: { type: 'timestamp', default: pgm.func('current_timestamp') },
    updated_at: { type: 'timestamp', default: pgm.func('current_timestamp') },
  });
  pgm.addConstraint('departments', 'departments_status_check', 'CHECK (status IN (\'Active\', \'Inactive\'))');

  // Courses Table
  pgm.createTable('courses', {
    id: 'id',
    course_code: { type: 'varchar(20)', notNull: true, unique: true },
    course_name: { type: 'varchar(100)', notNull: true },
    duration: { type: 'integer', notNull: true },
    total_semesters: { type: 'integer', notNull: true },
    description: { type: 'text' },
    status: { type: 'varchar(20)', default: 'Active' },
    created_at: { type: 'timestamp', default: pgm.func('current_timestamp') },
    updated_at: { type: 'timestamp', default: pgm.func('current_timestamp') },
    department_id: { type: 'integer', references: '"departments"' }
  });

  // Teachers Table
  pgm.createTable('teachers', {
    id: 'id',
    user_id: { type: 'integer', notNull: true, unique: true, references: '"users"', onDelete: 'CASCADE' },
    employee_id: { type: 'varchar(20)', unique: true },
    designation: { type: 'varchar(100)' },
    qualification: { type: 'varchar(150)' },
    specialization: { type: 'varchar(150)' },
    experience_years: { type: 'integer', default: 0 },
    joining_date: { type: 'date' },
    office_room: { type: 'varchar(50)' },
    profile_photo: { type: 'text' },
    status: { type: 'varchar(20)', default: 'Active' },
    gender: { type: 'varchar(6)' },
    department_id: { type: 'integer', references: '"departments"' }
  });

  // Classes Table
  pgm.createTable('classes', {
    id: 'id',
    class_name: { type: 'varchar(255)', notNull: true },
    course_id: { type: 'integer', references: '"courses"', onDelete: 'CASCADE' },
    semester: { type: 'integer', notNull: true },
    division: { type: 'varchar(50)', notNull: true },
    mft_id: { type: 'integer', references: '"teachers"(user_id)', onDelete: 'SET NULL' },
    created_at: { type: 'timestamp', default: pgm.func('current_timestamp') }
  });

  // Students Table
  pgm.createTable('students', {
    id: 'id',
    user_id: { type: 'integer', notNull: true, unique: true, references: '"users"', onDelete: 'CASCADE' },
    enrollment_no: { type: 'varchar(20)', notNull: true, unique: true },
    semester: { type: 'integer' },
    admission_year: { type: 'integer' },
    father_name: { type: 'varchar(100)' },
    mother_name: { type: 'varchar(100)' },
    guardian_phone: { type: 'varchar(15)' },
    address: { type: 'text' },
    profile_photo: { type: 'text' },
    status: { type: 'varchar(20)', default: 'Active' },
    created_at: { type: 'timestamp', default: pgm.func('current_timestamp') },
    updated_at: { type: 'timestamp', default: pgm.func('current_timestamp') },
    department_id: { type: 'integer', references: '"departments"' },
    course_id: { type: 'integer', references: '"courses"' },
    class_id: { type: 'integer', references: '"classes"', onDelete: 'SET NULL' }
  });

  // Subjects Table
  pgm.createTable('subjects', {
    id: 'id',
    subject_code: { type: 'varchar(20)', notNull: true, unique: true },
    subject_name: { type: 'varchar(100)', notNull: true },
    course_id: { type: 'integer', references: '"courses"', onDelete: 'CASCADE' },
    semester: { type: 'integer', notNull: true },
    credits: { type: 'integer', default: 3 },
    status: { type: 'varchar(20)', default: 'Active' },
    created_at: { type: 'timestamp', default: pgm.func('current_timestamp') },
    updated_at: { type: 'timestamp', default: pgm.func('current_timestamp') }
  });

  // Subject Teachers (Junction Table)
  pgm.createTable('subject_teachers', {
    subject_id: { type: 'integer', notNull: true, references: '"subjects"', onDelete: 'CASCADE' },
    teacher_id: { type: 'integer', notNull: true, references: '"teachers"', onDelete: 'CASCADE' }
  });
  pgm.addConstraint('subject_teachers', 'subject_teachers_pkey', {
    primaryKey: ['subject_id', 'teacher_id']
  });

  // Leaves Table
  pgm.createTable('leaves', {
    leave_id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    user_id: { type: 'integer', references: '"users"', onDelete: 'CASCADE' },
    leave_type: { type: 'varchar(50)', notNull: true },
    start_date: { type: 'date', notNull: true },
    end_date: { type: 'date', notNull: true },
    reason: { type: 'text', notNull: true },
    status: { type: 'varchar(20)', default: 'Pending' },
    applied_at: { type: 'timestamp', default: pgm.func('current_timestamp') }
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable('leaves');
  pgm.dropTable('subject_teachers');
  pgm.dropTable('subjects');
  pgm.dropTable('students');
  pgm.dropTable('classes');
  pgm.dropTable('teachers');
  pgm.dropTable('courses');
  pgm.dropTable('departments', { cascade: true }); // drop constraint as well
  pgm.dropTable('users');
};
