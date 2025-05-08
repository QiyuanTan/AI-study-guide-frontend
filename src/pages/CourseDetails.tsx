import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Download, FileText, Trash2, User } from 'lucide-react';
import { useCourses } from '../context/CourseContext.tsx';
import { useNotes } from '../context/NotesContext.tsx';
import PageHeader from '../components/common/PageHeader.tsx';
import NoteItem from '../components/notes/NoteItem.tsx';
import CreateNoteButton from '../components/notes/CreateNoteButton.tsx';
import { Course } from '../types/course.ts';
import { Note } from '../types/note.ts';

const CourseDetails: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { courses, loading: coursesLoading } = useCourses();
  const { notes, removeNote, loading: notesLoading } = useNotes();
  const [course, setCourse] = useState<Course | null>(null);
  const [courseNotes, setCourseNotes] = useState<Note[]>([]);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState<string | null>(null);

  useEffect(() => {
    if (courseId && courses.length > 0) {
      const foundCourse = courses.find(c => c.id === courseId);
      if (foundCourse) {
        setCourse(foundCourse);
      }
    }
  }, [courseId, courses]);

  useEffect(() => {
    if (courseId && notes.length > 0) {
      const filteredNotes = notes.filter(note => note.course === courseId);
      setCourseNotes(filteredNotes);
    } else {
      setCourseNotes([]);
    }
  }, [courseId, notes]);

  const handleDeleteNote = async (noteId: string) => {
    try {
      await removeNote(noteId);
      setIsConfirmingDelete(null);
    } catch (error) {
      console.error("Failed to delete note:", error);
    }
  };

  if (coursesLoading || notesLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading course details...</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex flex-col justify-center items-center h-64">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Course not found</h2>
        <p className="text-gray-600 mb-4">The course you're looking for doesn't exist</p>
        <Link to="/" className="text-primary-600 hover:text-primary-700 font-medium">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={course.name}
        subtitle={`Instructor: ${course.instructor}`}
        breadcrumbs={[
          { label: 'Dashboard', to: '/' },
          { label: course.name }
        ]}
        actions={
          <Link
            to={`/course/${courseId}/quiz/generate`}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
          >
            Generate Quiz
          </Link>
        }
      />

      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Course Info */}
        <div className="md:col-span-1 bg-white rounded-lg shadow-card p-5 border border-gray-100">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Course Information</h3>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Instructor</p>
              <div className="flex items-center">
                <User size={16} className="text-gray-400 mr-2" />
                <span className="text-gray-800">{course.instructor}</span>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-gray-500 mb-1">Syllabus</p>
              {course.syllabus ? (
                <a
                  href={course.syllabus}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-primary-600 hover:text-primary-700"
                >
                  <FileText size={16} className="mr-2" />
                  <span>View Syllabus</span>
                  <Download size={14} className="ml-1" />
                </a>
              ) : (
                <span className="text-gray-500 text-sm italic">No syllabus available</span>
              )}
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="md:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Course Notes</h2>
          </div>

          <div className="space-y-4">
            <CreateNoteButton courseId={courseId} />
            
            {courseNotes.length === 0 ? (
              <div className="bg-white rounded-lg shadow-card p-6 text-center border border-gray-100">
                <h3 className="text-lg font-medium text-gray-800 mb-2">No notes yet</h3>
                <p className="text-gray-600">Start by creating your first note for this course</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {courseNotes.map(note => (
                  <div key={note.id} className="relative">
                    {isConfirmingDelete === note.id && (
                      <div className="absolute inset-0 bg-white bg-opacity-90 flex flex-col items-center justify-center rounded-lg z-10 p-4">
                        <p className="text-gray-800 font-medium mb-3">Are you sure you want to delete this note?</p>
                        <div className="flex space-x-3">
                          <button
                            onClick={() => setIsConfirmingDelete(null)}
                            className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleDeleteNote(note.id)}
                            className="px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                    <NoteItem
                      note={note}
                      courseId={courseId}
                      onDelete={() => setIsConfirmingDelete(note.id)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;