const fs = require('fs');

const files = [
  'd:/University_Management/Frontend/src/components/Admin/Student/StudentTable.jsx',
  'd:/University_Management/Frontend/src/components/Admin/Teacher/TeacherTable.jsx',
  'd:/University_Management/Frontend/src/components/Admin/Course/CourseTable.jsx',
  'd:/University_Management/Frontend/src/components/Admin/Department/DepartmentTable.jsx'
];

const replacement = `<Pagination page={page} setPage={setPage} totalPages={totalPages} />`;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  const regex = /<div className="flex items-center gap-4">[\s\S]*?<div className="flex gap-2">[\s\S]*?<\/div>\s*<\/div>/;
  
  if (regex.test(content)) {
    content = content.replace(regex, replacement);
    
    if (!content.includes('import Pagination')) {
      content = content.replace(/(import React.*?;\n)/, `$1import Pagination from "../../Common/Pagination";\n`);
    }
    
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  } else {
    console.log(`Could not find match in ${file}`);
  }
});
