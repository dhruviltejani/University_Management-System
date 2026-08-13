const fs = require('fs');

const files = [
  'd:/University_Management/Frontend/src/components/Admin/Student/StudentTable.jsx',
  'd:/University_Management/Frontend/src/components/Admin/Teacher/TeacherTable.jsx',
  'd:/University_Management/Frontend/src/components/Admin/Course/CourseTable.jsx',
  'd:/University_Management/Frontend/src/components/Admin/Department/DepartmentTable.jsx'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (!content.includes('import Pagination')) {
    content = 'import Pagination from "../../Common/Pagination";\n' + content;
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  }
});
