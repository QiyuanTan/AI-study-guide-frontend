import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  BookOpen, 
  ChevronDown, 
  ChevronRight, 
  FileText, 
  Plus, 
  Settings, 
  User, 
  X 
} from 'lucide-react';
import { useCourses } from '../../context/CourseContext.tsx';
import { useNotes } from '../../context/NotesContext.tsx';
import { Course } from '../../types/course.ts';
import { Note } from '../../types/note.ts';
import CreateCourseModal from '../courses/CreateCourseModal.tsx';

interface SidebarProps {
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const { courses, loading: coursesLoading } = useCourses();
  const { notesByCourse } = useNotes();
  const [expandedCourses, setExpandedCourses] = useState<Record<string, boolean>>({});
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Set the initial expanded state based on the current URL
  useEffect(() => {
    const path = location.pathname;
    const courseIdMatch = path.match(/\/course\/([^/]+)/);
    
    if (courseIdMatch && courseIdMatch[1]) {
      setExpandedCourses(prev => ({
        ...prev,
        [courseIdMatch[1]]: true
      }));
    }
  }, [location.pathname]);

  const toggleCourse = (courseId: string) => {
    setExpandedCourses(prev => ({
      ...prev,
      [courseId]: !prev[courseId]
    }));
  };

  const handleCreateCourse = () => {
    setIsCreateModalOpen(true);
  };

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200 shadow-sm">
      {/* Mobile close button */}
      <div className="flex justify-between items-center p-4 md:hidden">
        <h2 className="text-lg font-semibold text-gray-800">QuizGen</h2>
        <button 
          className="p-1 rounded-full hover:bg-gray-100 text-gray-500"
          onClick={onClose}
        >
          <X size={20} />
        </button>
      </div>

      {/* User info */}
      <div className="hidden md:flex items-center p-4 border-b border-gray-200">
        <div className="p-2 rounded-full bg-primary-100 text-primary-600">
          <User size={20} />
        </div>
        <div className="ml-3">
          <h3 className="font-medium text-sm">Student</h3>
          <p className="text-xs text-gray-500">student@example.com</p>
        </div>
      </div>

      {/* Courses section */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">My Courses</h2>
          <button 
            onClick={handleCreateCourse}
            className="p-1 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
            title="Add Course"
          >
            <Plus size={18} />
          </button>
        </div>

        {coursesLoading ? (
          <div className="py-3 px-4 text-sm text-gray-500">Loading courses...</div>
        ) : courses.length === 0 ? (
          <div className="py-3 px-4 text-sm text-gray-500">No courses yet. Create one to get started!</div>
        ) : (
          <div className="space-y-1">
            {courses.map((course: Course) => (
              <div key={course.id} className="rounded-md overflow-hidden">
                <div 
                  className="flex items-center justify-between p-2 hover:bg-gray-100 cursor-pointer rounded-md transition-colors"
                  onClick={() => toggleCourse(course.id)}
                >
                  <div className="flex items-center space-x-2">
                    <BookOpen size={16} className="text-primary-600" />
                    <span className="text-sm font-medium truncate">{course.name}</span>
                  </div>
                  <button>
                    {expandedCourses[course.id] ? (
                      <ChevronDown size={16} className="text-gray-400" />
                    ) : (
                      <ChevronRight size={16} className="text-gray-400" />
                    )}
                  </button>
                </div>
                
                {expandedCourses[course.id] && (
                  <div className="ml-6 mt-1 space-y-1">
                    <Link
                      to={`/course/${course.id}`}
                      className="flex items-center p-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md"
                      onClick={onClose}
                    >
                      <span className="truncate">Course Details</span>
                    </Link>
                    
                    {notesByCourse[course.id] && notesByCourse[course.id].map((note: Note) => (
                      <Link
                        key={note.id}
                        to={`/course/${course.id}/note/${note.id}`}
                        className="flex items-center p-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md"
                        onClick={onClose}
                      >
                        <FileText size={14} className="mr-2 text-gray-400" />
                        <span className="truncate">{note.title}</span>
                      </Link>
                    ))}
                    
                    <Link
                      to={`/course/${course.id}/quiz/generate`}
                      className="flex items-center p-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md font-medium"
                      onClick={onClose}
                    >
                      <Plus size={14} className="mr-2" />
                      <span>Generate Quiz</span>
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <button className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 transition-colors">
          <Settings size={16} className="mr-2" />
          <span>Settings</span>
        </button>
      </div>

      {/* Create Course Modal */}
      {isCreateModalOpen && (
        <CreateCourseModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={(courseId) => {
            setIsCreateModalOpen(false);
            navigate(`/course/${courseId}`);
            onClose();
          }}
        />
      )}
    </div>
  );
};

export default Sidebar;