const fs = require('fs');
const path = require('path');

const files = [
  'd:/University_Management/Frontend/src/components/Admin/Student/StudentTable.jsx',
  'd:/University_Management/Frontend/src/components/Admin/Teacher/TeacherTable.jsx',
  'd:/University_Management/Frontend/src/components/Admin/Course/CourseTable.jsx',
  'd:/University_Management/Frontend/src/components/Admin/Department/DepartmentTable.jsx'
];

const replacement = `
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-500 font-medium">
            Page {page} of {totalPages || 1}
          </span>
          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              disabled={page === totalPages || totalPages === 0}
              onClick={() => setPage(page + 1)}
              className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>`;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Find the block starting with `<div className="flex gap-2">` and ending after the last `</button>` before `</div>`
  const regex = /<div className="flex gap-2">[\s\S]*?<button[\s\S]*?onClick=\{\(\) => setPage\(page \+ 1\)\}[\s\S]*?<\/button>\s*<\/div>/;
  
  if (regex.test(content)) {
    content = content.replace(regex, replacement.trim());
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  } else {
    console.log(`Could not find match in ${file}`);
  }
});
