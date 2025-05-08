import React from 'react';
import { Question } from '../../types/quiz.ts';

interface QuizQuestionProps {
  question: Question;
  index: number;
  selectedAnswer: string;
  onAnswerSelect: (answer: string) => void;
  showResult?: boolean;
  isCorrect?: boolean;
  correctOption?: string;
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  index,
  selectedAnswer,
  onAnswerSelect,
  showResult = false,
  isCorrect,
  correctOption,
}) => {
  const getOptionClassName = (option: string) => {
    if (!showResult) {
      return `border ${
        selectedAnswer === option
          ? 'bg-primary-50 border-primary-500'
          : 'border-gray-300 hover:border-primary-400'
      } rounded-md p-3 mb-2 cursor-pointer transition-colors`;
    }

    if (question.question_type === 'mcq') {
      if (option === correctOption) {
        return 'border border-green-500 bg-green-50 rounded-md p-3 mb-2';
      } else if (selectedAnswer === option && selectedAnswer !== correctOption) {
        return 'border border-red-500 bg-red-50 rounded-md p-3 mb-2';
      }
    }

    return 'border border-gray-300 rounded-md p-3 mb-2';
  };

  return (
    <div className="mb-6 p-4 bg-white rounded-lg shadow-sm">
      <div className="flex items-start gap-3 mb-3">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 text-primary-800 flex items-center justify-center font-semibold">
          {index + 1}
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-800">{question.title}</h3>
          {question.context && (
            <p className="text-sm text-gray-600 mt-1">{question.context}</p>
          )}
        </div>
      </div>

      {question.topics.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-1">
          {question.topics.map((topic, i) => (
            <span
              key={i}
              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
            >
              {topic}
            </span>
          ))}
        </div>
      )}

      {question.question_type === 'mcq' ? (
        <div className="mt-4">
          {question.options.map((option, optionIndex) => (
            <div
              key={optionIndex}
              className={getOptionClassName(option)}
              onClick={() => !showResult && onAnswerSelect(option)}
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 w-6">
                  <span className="font-medium">{String.fromCharCode(65 + optionIndex)}.</span>
                </div>
                <div className="ml-2">{option}</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-4">
          <textarea
            value={selectedAnswer}
            onChange={(e) => onAnswerSelect(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md min-h-[120px] focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Enter your code answer here..."
            disabled={showResult}
          />
          {showResult && (
            <div className={`mt-2 p-3 rounded-md ${isCorrect ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
              {isCorrect ? 'Correct!' : 'Incorrect'}
              {correctOption && (
                <div className="mt-1">
                  <strong>Expected answer:</strong> {correctOption}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuizQuestion;