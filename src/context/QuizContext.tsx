import React, { createContext, useContext, useState, ReactNode } from 'react';
import { generateQuiz, submitQuiz } from '../services/api';
import { Question, QuizResult } from '../types/quiz';

interface QuizContextType {
  questions: Question[];
  answers: string[];
  results: QuizResult[] | null;
  loading: boolean;
  error: string | null;
  generateQuestions: (courseId: string, options?: { topics?: string[]; question_type?: string }) => Promise<void>;
  setAnswer: (index: number, answer: string) => void;
  submitAnswers: (courseId: string) => Promise<void>;
  clearQuiz: () => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};

interface QuizProviderProps {
  children: ReactNode;
}

const QuizProvider: React.FC<QuizProviderProps> = ({ children }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [results, setResults] = useState<QuizResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateQuestions = async (
    courseId: string, 
    options?: { topics?: string[]; question_type?: string }
  ) => {
    try {
      setLoading(true);
      setError(null);
      setResults(null);
      
      const response = await generateQuiz(courseId, options || {});
      const fetchedQuestions = response.data;
      
      setQuestions(fetchedQuestions);
      setAnswers(new Array(fetchedQuestions.length).fill(''));
    } catch (err) {
      setError('Failed to generate quiz');
      console.error('Error generating quiz:', err);
    } finally {
      setLoading(false);
    }
  };

  const setAnswer = (index: number, answer: string) => {
    setAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[index] = answer;
      return newAnswers;
    });
  };

  const submitAnswers = async (courseId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const submission = answers.map(answer => ({ answer }));
      const response = await submitQuiz(courseId, { submission });
      
      setResults(response.data.results);
      return response.data.results;
    } catch (err) {
      setError('Failed to submit quiz');
      console.error('Error submitting quiz:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearQuiz = () => {
    setQuestions([]);
    setAnswers([]);
    setResults(null);
    setError(null);
  };

  const value = {
    questions,
    answers,
    results,
    loading,
    error,
    generateQuestions,
    setAnswer,
    submitAnswers,
    clearQuiz,
  };

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
};

export default QuizProvider;