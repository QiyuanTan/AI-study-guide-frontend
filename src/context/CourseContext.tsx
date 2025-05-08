import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getCourses, createCourse, updateCourse, deleteCourse } from '../services/api.ts';
import { Course } from '../types/course.ts';

interface CourseContextType {
  courses: Course[];
  loading: boolean;
  error: string | null;
  fetchCourses: () => Promise<void>;
  addCourse: (data: FormData) => Promise<string>;
  updateCourse: (id: string, data: FormData) => Promise<void>;
  removeCourse: (id: string) => Promise<void>;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export const useCourses = () => {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error('useCourses must be used within a CourseProvider');
  }
  return context;
};

interface CourseProviderProps {
  children: ReactNode;
}

const CourseProvider: React.FC<CourseProviderProps> = ({ children }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await getCourses();
      setCourses(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch courses');
      console.error('Error fetching courses:', err);
    } finally {
      setLoading(false);
    }
  };

  const addCourse = async (data: FormData): Promise<string> => {
    try {
      const response = await createCourse(data);
      await fetchCourses();
      return response.data.id;
    } catch (err) {
      setError('Failed to create course');
      console.error('Error creating course:', err);
      throw err;
    }
  };

  const updateCourseData = async (id: string, data: FormData) => {
    try {
      await updateCourse(id, data);
      await fetchCourses();
    } catch (err) {
      setError('Failed to update course');
      console.error('Error updating course:', err);
      throw err;
    }
  };

  const removeCourse = async (id: string) => {
    try {
      await deleteCourse(id);
      setCourses(courses.filter(course => course.id !== id));
    } catch (err) {
      setError('Failed to delete course');
      console.error('Error deleting course:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const value = {
    courses,
    loading,
    error,
    fetchCourses,
    addCourse,
    updateCourse: updateCourseData,
    removeCourse,
  };

  return <CourseContext.Provider value={value}>{children}</CourseContext.Provider>;
};

export default CourseProvider;