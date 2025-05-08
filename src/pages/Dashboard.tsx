import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lightbulb, BookText } from 'lucide-react';
import { useCourses } from '../context/CourseContext.tsx';
import { useNotes } from '../context/NotesContext.tsx';
import PageHeader from '../components/common/PageHeader.tsx';
import CreateCourseModal from '../components/courses/CreateCourseModal.tsx';
import { Note } from '../types/note.ts';

const Dashboard: React.FC = () => {
  const { courses, loading: loadingCourses } = useCourses();
  const { notes, loading: loadingNotes } = useNotes();
  const [recentNotes, setRecentNotes] = useState<Note[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (notes.length > 0) {
      // Sort notes by updated_at or created_at (most recent first)
      const sorted = [...notes].sort((a, b) => {
        const aDate = a.updated_at || a.created_at || '';
        const bDate = b.updated_at || b.created_at || '';
        return new Date(bDate).getTime() - new Date(aDate).getTime();
      });
      
      setRecentNotes(sorted.slice(0, 5));
    }
  }, [notes]);

  const getCourseName = (courseId: string) => {
    const course = courses.find((c) => c.id === courseId);
    return course ? course.name : 'Unknown Course';
  };

  // Strip HTML tags for preview
  const getContentPreview = (html: string) => {
    const div = document.createElement('div');
    div.innerHTML = html;
    const text = div.textContent || div.innerText || '';
    return text.length > 120 ? text.substring(0, 120) + '...' : text;
  };

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Welcome to your study assistant dashboard"
        actions={
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
          >
            New Course
          </button>
        }
      />

      {loadingCourses || loadingNotes ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Loading your study data...</div>
        </div>
      ) : (
        <>
          {/* Dashboard summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow-card p-5 border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-gray-500 text-sm font-medium">Total Courses</h3>
                <div className="p-2 bg-blue-50 rounded-md text-blue-600">
                  <BookText size={20} />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-800">{courses.length}</div>
            </div>
            
            <div className="bg-white rounded-lg shadow-card p-5 border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-gray-500 text-sm font-medium">Total Notes</h3>
                <div className="p-2 bg-green-50 rounded-md text-green-600">
                  <Lightbulb size={20} />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-800">{notes.length}</div>
            </div>
          </div>

          {/* Course cards */}
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Courses</h2>
          {courses.length === 0 ? (
            <div className="bg-white rounded-lg shadow-card p-6 text-center border border-gray-100">
              <h3 className="text-lg font-medium text-gray-800 mb-2">No courses yet</h3>
              <p className="text-gray-600 mb-4">Create your first course to get started</p>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
              >
                Create Course
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="bg-white rounded-lg shadow-card hover:shadow-card-hover cursor-pointer transition-all p-5 border border-gray-100"
                  onClick={() => navigate(`/course/${course.id}`)}
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{course.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">Instructor: {course.instructor}</p>
                  <div className="flex justify-between items-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/course/${course.id}/quiz/generate`);
                      }}
                      className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                    >
                      Generate Quiz
                    </button>
                    <span className="text-xs text-gray-500">
                      {notes.filter((note) => note.course === course.id).length} notes
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Recent notes */}
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Notes</h2>
          {recentNotes.length === 0 ? (
            <div className="bg-white rounded-lg shadow-card p-6 text-center border border-gray-100">
              <p className="text-gray-600">You haven't created any notes yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {recentNotes.map((note) => (
                <div
                  key={note.id}
                  className="bg-white rounded-lg shadow-card hover:shadow-card-hover cursor-pointer transition-all p-5 border border-gray-100"
                  onClick={() => navigate(`/course/${note.course}/note/${note.id}`)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{note.title}</h3>
                      <p className="text-xs text-gray-500">{getCourseName(note.course)}</p>
                    </div>
                    {note.updated_at && (
                      <span className="text-xs text-gray-500">
                        {new Date(note.updated_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{getContentPreview(note.content)}</p>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Create Course Modal */}
      {isCreateModalOpen && (
        <CreateCourseModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={(courseId) => {
            setIsCreateModalOpen(false);
            navigate(`/course/${courseId}`);
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;