import api from './api.js';

// Student service for managing student data and progress
class StudentService {
  // Get student from localStorage or fetch from API
  async getCurrentStudent() {
    try {
      const savedStudent = localStorage.getItem('besafe_student');
      if (savedStudent) {
        const student = JSON.parse(savedStudent);
        // If student has an ID, fetch latest data from API
        if (student.id) {
          try {
            const response = await api.get(`/students/${student.id}`);
            if (response.data.success) {
              const updatedStudent = response.data.data;
              localStorage.setItem('besafe_student', JSON.stringify(updatedStudent));
              return updatedStudent;
            }
          } catch (error) {
            console.error('Error fetching student:', error);
            // Return cached student if API fails
            return student;
          }
        }
        return student;
      }
      return null;
    } catch (error) {
      console.error('Error getting student:', error);
      return null;
    }
  }

  // Save student to localStorage
  saveStudentToLocal(student) {
    try {
      localStorage.setItem('besafe_student', JSON.stringify(student));
    } catch (error) {
      console.error('Error saving student:', error);
    }
  }

  // Update daily streak - increments if last visit was not today
  async updateDailyStreak() {
    try {
      const student = await this.getCurrentStudent();
      if (!student || !student.id) return null;

      const today = new Date().toDateString();
      const lastVisitDate = localStorage.getItem('besafe_last_visit_date');

      // If last visit was not today, increment streak
      if (lastVisitDate !== today) {
        const newStreak = (lastVisitDate && this.isConsecutiveDay(lastVisitDate, today)) 
          ? (student.streak || 0) + 1 
          : 1; // Reset to 1 if not consecutive

        localStorage.setItem('besafe_last_visit_date', today);
        
        // Update streak in backend
        await this.updateProgress(student.id, { streak: newStreak });
        
        return newStreak;
      }

      return student.streak || 0;
    } catch (error) {
      console.error('Error updating streak:', error);
      return null;
    }
  }

  // Check if two dates are consecutive days
  isConsecutiveDay(date1, date2) {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffTime = Math.abs(d2 - d1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === 1;
  }

  // Add points to student
  async addPoints(points, reason = '') {
    try {
      const student = await this.getCurrentStudent();
      if (!student || !student.id) return null;

      const newPoints = (student.points || 0) + points;
      
      // Update points in backend
      const updatedStudent = await this.updateProgress(student.id, { points: newPoints });
      
      console.log(`Added ${points} points. Reason: ${reason}. Total: ${newPoints}`);
      return updatedStudent;
    } catch (error) {
      console.error('Error adding points:', error);
      return null;
    }
  }

  // Update student progress (points, streak, level, etc.)
  async updateProgress(studentId, updates) {
    try {
      const response = await api.patch(`/students/${studentId}/progress`, updates);
      if (response.data.success) {
        const updatedStudent = response.data.data;
        this.saveStudentToLocal(updatedStudent);
        return updatedStudent;
      }
      return null;
    } catch (error) {
      console.error('Error updating progress:', error);
      return null;
    }
  }

  // Get student by ID
  async getStudentById(id) {
    try {
      const response = await api.get(`/students/${id}`);
      if (response.data.success) {
        return response.data.data;
      }
      return null;
    } catch (error) {
      console.error('Error getting student:', error);
      return null;
    }
  }
}

export default new StudentService();

