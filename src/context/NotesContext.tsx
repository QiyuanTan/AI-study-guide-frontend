import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getNotes, createNote, updateNote, deleteNote } from '../services/api.ts';
import { Note } from '../types/note.ts';

interface NotesContextType {
  notes: Note[];
  notesByCourse: Record<string, Note[]>;
  loading: boolean;
  error: string | null;
  fetchNotes: () => Promise<void>;
  addNote: (data: { title: string; content: string; course: string }) => Promise<string>;
  updateNote: (id: string, data: { title: string; content: string; course: string }) => Promise<void>;
  removeNote: (id: string) => Promise<void>;
  getNotesByCourseId: (courseId: string) => Note[];
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
};

interface NotesProviderProps {
  children: ReactNode;
}

const NotesProvider: React.FC<NotesProviderProps> = ({ children }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [notesByCourse, setNotesByCourse] = useState<Record<string, Note[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const organizeNotesByCourse = (notesList: Note[]) => {
    const organized: Record<string, Note[]> = {};
    
    notesList.forEach(note => {
      if (!organized[note.course]) {
        organized[note.course] = [];
      }
      organized[note.course].push(note);
    });
    
    return organized;
  };

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const response = await getNotes();
      setNotes(response.data);
      setNotesByCourse(organizeNotesByCourse(response.data));
      setError(null);
    } catch (err) {
      setError('Failed to fetch notes');
      console.error('Error fetching notes:', err);
    } finally {
      setLoading(false);
    }
  };

  const addNote = async (data: { title: string; content: string; course: string }): Promise<string> => {
    try {
      const response = await createNote(data);
      await fetchNotes();
      return response.data.id;
    } catch (err) {
      setError('Failed to create note');
      console.error('Error creating note:', err);
      throw err;
    }
  };

  const updateNoteData = async (id: string, data: { title: string; content: string; course: string }) => {
    try {
      await updateNote(id, data);
      await fetchNotes();
    } catch (err) {
      setError('Failed to update note');
      console.error('Error updating note:', err);
      throw err;
    }
  };

  const removeNote = async (id: string) => {
    try {
      await deleteNote(id);
      setNotes(notes.filter(note => note.id !== id));
      setNotesByCourse(organizeNotesByCourse(notes.filter(note => note.id !== id)));
    } catch (err) {
      setError('Failed to delete note');
      console.error('Error deleting note:', err);
      throw err;
    }
  };

  const getNotesByCourseId = (courseId: string): Note[] => {
    return notesByCourse[courseId] || [];
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const value = {
    notes,
    notesByCourse,
    loading,
    error,
    fetchNotes,
    addNote,
    updateNote: updateNoteData,
    removeNote,
    getNotesByCourseId,
  };

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>;
};

export default NotesProvider;