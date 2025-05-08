import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AlertCircle, CheckCircle, ChevronLeft, ChevronRight, Clock, Save } from 'lucide-react';
import { useCourses } from '../context/CourseContext.tsx';
import { useQuiz } from '../context/QuizContext.tsx';
import PageHeader from '../components/common/PageHeader.tsx';
import QuizQuestion from '../components/quiz/QuizQuestion.tsx';

const QuizTaking: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { courses } = useCourses();
  const { questions, answers, setAnswer, submitAnswers, loading, error } = useQuiz();
  
  const [courseName, setCourseName] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [startTime] = useState(new Date());
  const [elapsedTime, setElapsedTime] = useState('00:00');

  useEffect(() => {
    if (courseId && courses.length > 0) {
      const course = courses.find(c => c.id === courseId);
      if (course) {
        setCourseName(course.name);
      }
    }
  }, [courseId, courses]);

  useEffect(() => {
    if (!questions || questions.length === 0) {
      navigate(`/course/${courseId}/quiz/generate`);
    }
  }, [questions, courseId, navigate]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();
      const diffInSeconds = Math.floor((now.getTime() - startTime.getTime()) / 1000);
      const minutes = Math.floor(diffInSeconds / 60).toString().padStart(2, '0');
      const seconds = (diffInSeconds % 60).toString().padStart(2, '0');
      setElapsedTime(`${minutes}:${seconds}`);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [startTime]);

  const handleAnswerChange = (answer: string) => {
    setAnswer(currentQuestion, answer);
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    if (!courseId) return;

    try {
      setIsSubmitting(true);
      await submitAnswers(courseId);
      navigate(`/course/${courseId}/quiz/results`);
    } catch (err) {
      console.error('Failed to submit quiz:', err);
      setIsSubmitting(false);
    }
  };

  if (loading || !questions || questions.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading quiz questions...</div>
      </div>
    );
  }

  const getProgress = () => {
    const answered = answers.filter(a => a !== '').length;
    return Math.floor((answered / questions.length) * 100);
  };

  return (
    <div>
      <PageHeader
        title="Take Quiz"
        subtitle={`Answer the questions for ${courseName}`}
        breadcrumbs={[
          { label: 'Dashboard', to: '/' },
          { label: courseName, to: `/course/${courseId}` },
          { label: 'Take Quiz' },
        ]}
      />

      {/* Quiz controls */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex justify-between items-center">
        <div className="flex items-center">
          <Clock size={18} className="text-gray-500 mr-2" />
          <span className="text-gray-700">{elapsedTime}</span>
        </div>
        
        <div className="flex items-center">
          <span className="text-sm text-gray-600 mr-3">
            Question {currentQuestion + 1} of {questions.length}
          </span>
          
          <div className="flex gap-2">
            <button
              onClick={prevQuestion}
              disabled={currentQuestion === 0}
              className="p-1.5 rounded-full text-gray-500 hover:bg-gray-100 disabled:opacity-50"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextQuestion}
              disabled={currentQuestion === questions.length - 1}
              className="p-1.5 rounded-full text-gray-500 hover:bg-gray-100 disabled:opacity-50"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="bg-white rounded-lg shadow-sm p-3 mb-6">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-gray-700">
            Progress: {getProgress()}%
          </span>
          <span className="text-sm text-gray-500">
            {answers.filter(a => a !== '').length} of {questions.length} answered
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-primary-600 h-2.5 rounded-full"
            style={{ width: `${getProgress()}%` }}
          ></div>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md flex items-start">
          <AlertCircle size={20} className="mr-2 flex-shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {/* Current question */}
      <div className="mb-6">
        {questions[currentQuestion] && (
          <QuizQuestion
            question={questions[currentQuestion]}
            index={currentQuestion}
            selectedAnswer={answers[currentQuestion] || ''}
            onAnswerSelect={handleAnswerChange}
          />
        )}
      </div>

      {/* Question navigation */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="mb-3">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Question Navigation</h3>
          <div className="flex flex-wrap gap-2">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                  currentQuestion === index
                    ? 'bg-primary-600 text-white'
                    : answers[index]
                    ? 'bg-green-100 text-green-800 border border-green-300'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex justify-between">
          <Link
            to={`/course/${courseId}/quiz/generate`}
            className="text-gray-600 hover:text-gray-900"
          >
            Back to Generator
          </Link>
          
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || answers.some(a => a === '')}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:bg-primary-300 flex items-center"
          >
            {isSubmitting ? (
              'Submitting...'
            ) : answers.some(a => a === '') ? (
              <>Answer All Questions</>
            ) : (
              <>
                <CheckCircle size={18} className="mr-2" />
                Submit Quiz
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizTaking;