import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Award, CheckCircle, RotateCcw, XCircle } from 'lucide-react';
import { useCourses } from '../context/CourseContext.tsx';
import { useQuiz } from '../context/QuizContext.tsx';
import PageHeader from '../components/common/PageHeader.tsx';
import QuizQuestion from '../components/quiz/QuizQuestion.tsx';

const QuizResults: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { courses } = useCourses();
  const { questions, answers, results, clearQuiz } = useQuiz();
  
  const [courseName, setCourseName] = useState('');
  const [score, setScore] = useState({ correct: 0, total: 0, percentage: 0 });
  const [topicScores, setTopicScores] = useState<Record<string, { correct: number; total: number }>>({});

  useEffect(() => {
    if (courseId && courses.length > 0) {
      const course = courses.find(c => c.id === courseId);
      if (course) {
        setCourseName(course.name);
      }
    }
  }, [courseId, courses]);

  useEffect(() => {
    if (!results || results.length === 0 || !questions) {
      navigate(`/course/${courseId}/quiz/generate`);
      return;
    }

    // Calculate overall score
    const correctCount = results.filter(r => r.correct).length;
    setScore({
      correct: correctCount,
      total: results.length,
      percentage: Math.round((correctCount / results.length) * 100),
    });

    // Calculate topic scores
    const topicsMap: Record<string, { correct: number; total: number }> = {};
    
    questions.forEach((question, index) => {
      question.topics.forEach(topic => {
        if (!topicsMap[topic]) {
          topicsMap[topic] = { correct: 0, total: 0 };
        }
        
        topicsMap[topic].total += 1;
        
        if (results[index]?.correct) {
          topicsMap[topic].correct += 1;
        }
      });
    });
    
    setTopicScores(topicsMap);
  }, [results, questions, courseId, navigate]);

  const handleTakeNewQuiz = () => {
    clearQuiz();
    navigate(`/course/${courseId}/quiz/generate`);
  };

  if (!results || !questions || questions.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">No quiz results available</div>
      </div>
    );
  }

  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 80) return 'text-green-500';
    if (percentage >= 70) return 'text-yellow-600';
    if (percentage >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getLetterGrade = (percentage: number) => {
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
  };

  return (
    <div>
      <PageHeader
        title="Quiz Results"
        subtitle={`Your performance for ${courseName}`}
        breadcrumbs={[
          { label: 'Dashboard', to: '/' },
          { label: courseName, to: `/course/${courseId}` },
          { label: 'Quiz Results' },
        ]}
        actions={
          <button
            onClick={handleTakeNewQuiz}
            className="px-4 py-2 flex items-center gap-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            <RotateCcw size={16} />
            <span>Take New Quiz</span>
          </button>
        }
      />

      {/* Score summary */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row items-center justify-between mb-6">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="p-3 rounded-full bg-primary-100 mr-4">
              <Award size={30} className={getGradeColor(score.percentage)} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {score.percentage}% 
                <span className={`ml-2 ${getGradeColor(score.percentage)}`}>
                  {getLetterGrade(score.percentage)}
                </span>
              </h2>
              <p className="text-gray-600">
                {score.correct} correct out of {score.total} questions
              </p>
            </div>
          </div>
          
          <div className="text-center">
            {score.percentage >= 70 ? (
              <div className="flex items-center text-green-600">
                <CheckCircle size={20} className="mr-2" />
                <span className="font-medium">Passed</span>
              </div>
            ) : (
              <div className="flex items-center text-red-600">
                <XCircle size={20} className="mr-2" />
                <span className="font-medium">Needs Improvement</span>
              </div>
            )}
          </div>
        </div>
        
        <h3 className="text-lg font-medium text-gray-800 mb-3">Performance by Topic</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(topicScores).map(([topic, stats]) => {
            const percentage = Math.round((stats.correct / stats.total) * 100);
            return (
              <div key={topic} className="bg-gray-50 rounded-md p-3">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="font-medium text-gray-800">{topic}</h4>
                  <span className={getGradeColor(percentage)}>
                    {percentage}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      percentage >= 70 ? 'bg-green-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {stats.correct} / {stats.total} correct
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed results */}
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Question Details</h2>
      <div className="space-y-4 mb-6">
        {questions.map((question, index) => (
          <QuizQuestion
            key={index}
            question={question}
            index={index}
            selectedAnswer={answers[index] || ''}
            onAnswerSelect={() => {}}
            showResult={true}
            isCorrect={results[index]?.correct}
            correctOption={results[index]?.correct_option}
          />
        ))}
      </div>

      <div className="flex justify-center mb-8">
        <Link
          to={`/course/${courseId}`}
          className="px-4 py-2 text-gray-600 mr-4 hover:text-gray-800"
        >
          Back to Course
        </Link>
        <button
          onClick={handleTakeNewQuiz}
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
        >
          Generate New Quiz
        </button>
      </div>
    </div>
  );
};

export default QuizResults;