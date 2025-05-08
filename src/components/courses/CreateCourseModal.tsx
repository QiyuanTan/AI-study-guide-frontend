import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useCourses } from '../../context/CourseContext.tsx';

interface CreateCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (courseId: string) => void;
}

const CreateCourseModal: React.FC<CreateCourseModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [name, setName] = useState('');
  const [instructor, setInstructor] = useState('');
  const [syllabus, setSyllabus] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addCourse } = useCourses();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !instructor.trim() || !syllabus) {
      setError('All fields are required');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      const formData = new FormData();
      formData.append('name', name);
      formData.append('instructor', instructor);
      formData.append('syllabus', syllabus);
      
      const courseId = await addCourse(formData);
      onSuccess(courseId);
    } catch (err) {
      setError('Failed to create course. Please try again.');
      console.error('Error creating course:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl animate-fade-in">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Create New Course</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-md">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Course Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="e.g., Introduction to Computer Science"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="instructor" className="block text-sm font-medium text-gray-700 mb-1">
              Instructor
            </label>
            <input
              type="text"
              id="instructor"
              value={instructor}
              onChange={(e) => setInstructor(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="e.g., Dr. Jane Smith"
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="syllabus" className="block text-sm font-medium text-gray-700 mb-1">
              Syllabus (PDF)
            </label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {syllabus ? (
                    <p className="text-sm text-gray-700">
                      Selected: <span className="font-medium">{syllabus.name}</span>
                    </p>
                  ) : (
                    <>
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">PDF only</p>
                    </>
                  )}
                </div>
                <input
                  id="syllabus"
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={(e) => setSyllabus(e.target.files ? e.target.files[0] : null)}
                />
              </label>
            </div>
          </div>
          
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCourseModal;