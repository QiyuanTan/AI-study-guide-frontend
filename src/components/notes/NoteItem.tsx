import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Edit, Trash2 } from 'lucide-react';
import { Note } from '../../types/note';

interface NoteItemProps {
  note: Note;
  courseId: string | undefined;
  onDelete: () => void;
}

const NoteItem: React.FC<NoteItemProps> = ({ note, courseId, onDelete }) => {
  // Strip HTML tags for preview
  const getContentPreview = (html: string) => {
    const div = document.createElement('div');
    div.innerHTML = html;
    const text = div.textContent || div.innerText || '';
    return text.length > 100 ? text.substring(0, 100) + '...' : text;
  };

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-card hover:shadow-card-hover transition-shadow p-4 border border-gray-100">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-medium text-gray-800">{note.title}</h3>
        <div className="flex space-x-2">
          <Link
            to={`/course/${courseId}/note/${note.id}`}
            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
            title="Edit Note"
          >
            <Edit size={16} />
          </Link>
          <button
            onClick={onDelete}
            className="p-1.5 rounded-full hover:bg-red-50 text-gray-500 hover:text-red-500 transition-colors"
            title="Delete Note"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <p className="text-sm text-gray-600 line-clamp-3 mb-3">
        {getContentPreview(note.content)}
      </p>

      {note.updated_at && (
        <div className="flex items-center text-xs text-gray-500">
          <Clock size={12} className="mr-1" />
          <span>Updated {formatDate(note.updated_at)}</span>
        </div>
      )}
    </div>
  );
};

export default NoteItem;