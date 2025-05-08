import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout.tsx';
import Dashboard from './pages/Dashboard.tsx';
import CourseDetails from './pages/CourseDetails.tsx';
import NoteEditor from './pages/NoteEditor.tsx';
import QuizGenerator from './pages/QuizGenerator.tsx';
import QuizTaking from './pages/QuizTaking.tsx';
import QuizResults from './pages/QuizResults.tsx';
import CourseProvider from './context/CourseContext.tsx';
import NotesProvider from './context/NotesContext.tsx';
import QuizProvider from './context/QuizContext.tsx';

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