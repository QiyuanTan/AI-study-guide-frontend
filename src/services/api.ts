import axios from 'axios';

const API_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Course API
export const getCourses = () => api.get('/api/course/');
export const getCourse = (id: string) => api.get(`/api/course/${id}/`);
export const createCourse = (data: FormData) => api.post('/api/course/', data, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});
export const updateCourse = (id: string, data: FormData) => api.put(`/api/course/${id}/`, data, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});
export const deleteCourse = (id: string) => api.delete(`/api/course/${id}/`);

// Notes API
export const getNotes = () => api.get('/api/note/');
export const getNote = (id: string) => api.get(`/api/note/${id}/`);
export const createNote = (data: { title: string; content: string; course: string }) => 
  api.post('/api/note/', data);
export const updateNote = (id: string, data: { title: string; content: string; course: string }) => 
  api.put(`/api/note/${id}/`, data);
export const deleteNote = (id: string) => api.delete(`/api/note/${id}/`);

// Quiz API
export const generateQuiz = (courseId: string, data: { topics?: string[]; question_type?: string }) => 
  api.post(`/api/course/${courseId}/generate_quiz/`, data);
export const submitQuiz = (courseId: string, data: { submission: { answer: string }[] }) => 
  api.post(`/api/course/${courseId}/submit_quiz/`, data);

export default api;