// In-memory database for students
// In production, this would be replaced with a real database (MongoDB, PostgreSQL, etc.)

// Note: The test user password is '123456'
// In production, use bcrypt.hashSync('123456', 10) to generate the hash
// For now, we'll initialize it empty and it will be set on first run if needed
let students = [];

let nextId = 1;

export const getStudentById = (id) => {
  return students.find(s => s.id === parseInt(id));
};

export const getStudentByEmail = (email) => {
  return students.find(s => s.email === email);
};

export const getStudentByPhone = (phone) => {
  return students.find(s => s.phone === phone);
};

export const getStudentByUsername = (username) => {
  return students.find(s => s.username === username);
};

export const getStudentByEmailOrPhone = (emailOrPhone) => {
  return students.find(s => s.email === emailOrPhone || s.phone === emailOrPhone || s.username === emailOrPhone);
};

export const createStudent = (studentData) => {
  const newStudent = {
    id: nextId++,
    ...studentData,
    points: 0,
    streak: 0,
    currentLevel: 1,
    completedLevels: 0,
    createdAt: new Date().toISOString()
  };
  students.push(newStudent);
  return newStudent;
};

export const updateStudent = (id, updates) => {
  const index = students.findIndex(s => s.id === parseInt(id));
  if (index === -1) return null;
  
  students[index] = { ...students[index], ...updates };
  return students[index];
};

export const deleteStudent = (id) => {
  const index = students.findIndex(s => s.id === parseInt(id));
  if (index === -1) return false;
  
  students.splice(index, 1);
  return true;
};

export const getAllStudents = () => {
  return students;
};

