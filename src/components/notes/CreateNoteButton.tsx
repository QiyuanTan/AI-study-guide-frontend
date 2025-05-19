import React, { useState } from 'react';
import { FilePlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNotes } from '../../context/NotesContext';

interface CreateNoteButtonProps {
  courseId: string;
}

const CreateNoteButton: React.FC<CreateNoteButtonProps> = ({ courseId }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { addNote } = useNotes();

  const handleCreate = async () => {
    if (!title.trim()) {
      setError('Note title is required');
      return;
    }

    try {
      setError(null);
      const noteId = await addNote({
        title: title.trim(),
        content: '',
        course: courseId,
      });
      navigate(`/course/${courseId}/note/${noteId}`);
    } catch (err) {
      setError('Failed to create note');
      console.error('Error creating note:', err);
    }
  };

  if (!isCreating) {
    return (
      <button
        onClick={() => setIsCreating(true)}
        className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
      >
        <FilePlus size={18} />
        <span>Create Note</span>
      </button>
    );
  }

  return (
    <div className="flex flex-col p-4 bg-white rounded-lg shadow-md border border-gray-200">
      <h3 className="text-lg font-medium mb-3">Create New Note</h3>

      {error && (
        <div className="mb-3 p-2 bg-red-50 text-red-700 text-sm rounded">
          {error}
        </div>
      )}

      <div className="mb-3">
        <label htmlFor="note-title" className="block text-sm font-medium text-gray-700 mb-1">
          Note Title
        </label>
        <input
          type="text"
          id="note-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="Enter note title"
        />
      </div>

      <div className="flex justify-end gap-2">
        <button
          onClick={() => setIsCreating(false)}
          className="px-3 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={handleCreate}
          className="px-3 py-1.5 text-sm text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Create Note
        </button>
      </div>
    </div>
  );
};

export default CreateNoteButton;