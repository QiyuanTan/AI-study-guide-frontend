import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import CourseDetails from './pages/CourseDetails';
import NoteEditor from './pages/NoteEditor';
import QuizGenerator from './pages/QuizGenerator';
import QuizTaking from './pages/QuizTaking';
import QuizResults from './pages/QuizResults';
import CourseProvider from './context/CourseContext';
import NotesProvider from './context/NotesContext';
import QuizProvider from './context/QuizContext';

function App() {
  return (
    <CourseProvider>
      <NotesProvider>
        <QuizProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="course/:courseId" element={<CourseDetails />} />
              <Route path="course/:courseId/note/:noteId" element={<NoteEditor />} />
              <Route path="course/:courseId/quiz/generate" element={<QuizGenerator />} />
              <Route path="course/:courseId/quiz/take" element={<QuizTaking />} />
              <Route path="course/:courseId/quiz/results" element={<QuizResults />} />
            </Route>
          </Routes>
        </QuizProvider>
      </NotesProvider>
    </CourseProvider>
  );
}

export default App;