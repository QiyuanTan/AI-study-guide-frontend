import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Save, ArrowLeft, Trash2 } from 'lucide-react';
import { useNotes } from '../context/NotesContext';
import { useCourses } from '../context/CourseContext';
import PageHeader from '../components/common/PageHeader';

const NoteEditor: React.FC = () => {
  const { courseId, noteId } = useParams<{ courseId: string; noteId: string }>();
  const { notes, updateNote, removeNote } = useNotes();
  const { courses } = useCourses();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [courseName, setCourseName] = useState('');

  useEffect(() => {
    if (courseId && courses.length > 0) {
      const course = courses.find(c => c.id === courseId);
      if (course) {
        setCourseName(course.name);
      }
    }
  }, [courseId, courses]);

  useEffect(() => {
    console.log('Notes:', notes);
  }, [notes]);

  useEffect(() => {
    if (noteId) {
      if (notes.length === 0) {
        // Wait for notes to load
        return;
      }

      const note = notes.find(n => n.id === Number(noteId)); // Convert noteId to a number
      if (note) {
        setTitle(note.title);
        setContent(note.content);
      } else {
        console.warn(`Note with ID ${noteId} not found.`);
        // Only navigate after confirming data is loaded
        navigate(`/course/${courseId}`);
      }
    }
  }, [noteId, notes, navigate, courseId]);

  const handleSave = async () => {
    if (!courseId || !noteId) return;
    
    try {
      setIsSaving(true);
      await updateNote(noteId, {
        title,
        content,
        course: courseId,
      });
      setLastSaved(new Date());
    } catch (error) {
      console.error('Failed to save note:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!noteId) return;
    
    try {
      setIsLoading(true);
      await removeNote(noteId);
      navigate(`/course/${courseId}`);
    } catch (error) {
      console.error('Failed to delete note:', error);
      setIsLoading(false);
    }
  };

  // Auto-save
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    if (title && content) {
      timeoutId = setTimeout(() => {
        handleSave();
      }, 5000);
    }
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [title, content]);

  // Quill editor modules
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ color: [] }, { background: [] }],
      ['link', 'code-block'],
      ['clean'],
    ],
    clipboard: {
      matchVisual: false,
    },
    history: {
      delay: 2000,
      maxStack: 500,
      userOnly: true,
    },
  };

  return (
    <div>
      <PageHeader
        title={title || 'Untitled Note'}
        breadcrumbs={[
          { label: 'Dashboard', to: '/' },
          { label: courseName, to: `/course/${courseId}` },
          { label: title || 'Untitled Note' },
        ]}
        actions={
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(`/course/${courseId}`)}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft size={18} className="mr-1" />
              <span>Back</span>
            </button>
            
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center px-3 py-1.5 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-70"
            >
              <Save size={16} className="mr-1" />
              <span>{isSaving ? 'Saving...' : 'Save'}</span>
            </button>
            
            <button
              onClick={() => setIsConfirmingDelete(true)}
              className="flex items-center px-3 py-1.5 text-red-600 hover:text-red-700 disabled:opacity-70"
              disabled={isLoading}
            >
              <Trash2 size={16} className="mr-1" />
              <span>Delete</span>
            </button>
          </div>
        }
      />

      {lastSaved && (
        <div className="text-sm text-gray-500 mb-4">
          Last saved: {lastSaved.toLocaleTimeString()}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-5 mb-6">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note Title"
          className="w-full text-xl font-semibold mb-4 p-2 border-b border-gray-200 focus:outline-none focus:border-primary-500"
        />
        
        <ReactQuill
          value={content}
          onChange={setContent}
          modules={modules}
          placeholder="Start writing your note here..."
          className="min-h-[400px]"
        />
      </div>

      {/* Delete Confirmation Modal */}
      {isConfirmingDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Delete Note</h3>
            <p className="text-gray-600 mb-4">Are you sure you want to delete this note? This action cannot be undone.</p>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsConfirmingDelete(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoteEditor;