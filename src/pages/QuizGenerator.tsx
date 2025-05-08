import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AlertCircle, Book, CheckCircle, FileQuestion, Upload } from 'lucide-react';
import { useCourses } from '../context/CourseContext.tsx';
import { useQuiz } from '../context/QuizContext.tsx';
import PageHeader from '../components/common/PageHeader.tsx';

const QuizGenerator: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { courses } = useCourses();
  const { generateQuestions, loading, error } = useQuiz();
  
  const [courseName, setCourseName] = useState('');
  const [topics, setTopics] = useState('');
  const [questionType, setQuestionType] = useState<'all' | 'mcq' | 'code'>('all');
  const [file, setFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (courseId && courses.length > 0) {
      const course = courses.find(c => c.id === courseId);
      if (course) {
        setCourseName(course.name);
      }
    }
  }, [courseId, courses]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseId) return;

    try {
      setIsGenerating(true);
      
      const options: { topics?: string[]; question_type?: string } = {};
      
      if (topics) {
        options.topics = topics.split(',').map(t => t.trim());
      }
      
      if (questionType !== 'all') {
        options.question_type = questionType;
      }
      
      await generateQuestions(courseId, options);
      navigate(`/course/${courseId}/quiz/take`);
    } catch (err) {
      console.error('Failed to generate quiz:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Generate Quiz"
        subtitle={`Create a quiz for ${courseName}`}
        breadcrumbs={[
          { label: 'Dashboard', to: '/' },
          { label: courseName, to: `/course/${courseId}` },
          { label: 'Generate Quiz' },
        ]}
      />

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <form onSubmit={handleGenerate}>
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md flex items-start">
              <AlertCircle size={20} className="mr-2 flex-shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          <div className="mb-6">
            <div className="flex items-center mb-4">
              <Book size={20} className="mr-2 text-primary-600" />
              <h3 className="text-lg font-medium text-gray-800">Quiz Options</h3>
            </div>
            
            <div className="mb-4">
              <label htmlFor="topics" className="block text-sm font-medium text-gray-700 mb-1">
                Focus Topics (optional, comma separated)
              </label>
              <input
                type="text"
                id="topics"
                value={topics}
                onChange={(e) => setTopics(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="e.g., Data Structures, Algorithms, Complexity"
              />
              <p className="mt-1 text-xs text-gray-500">
                Leave empty to include all topics from your course and notes
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Question Types
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div
                  className={`border rounded-md p-3 cursor-pointer ${
                    questionType === 'all'
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-300 hover:border-primary-300'
                  }`}
                  onClick={() => setQuestionType('all')}
                >
                  <div className="flex items-center">
                    <div
                      className={`w-4 h-4 rounded-full mr-2 border ${
                        questionType === 'all'
                          ? 'border-primary-500 bg-primary-500'
                          : 'border-gray-400'
                      }`}
                    >
                      {questionType === 'all' && (
                        <CheckCircle size={16} className="text-white" />
                      )}
                    </div>
                    <span>All Question Types</span>
                  </div>
                </div>
                
                <div
                  className={`border rounded-md p-3 cursor-pointer ${
                    questionType === 'mcq'
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-300 hover:border-primary-300'
                  }`}
                  onClick={() => setQuestionType('mcq')}
                >
                  <div className="flex items-center">
                    <div
                      className={`w-4 h-4 rounded-full mr-2 border ${
                        questionType === 'mcq'
                          ? 'border-primary-500 bg-primary-500'
                          : 'border-gray-400'
                      }`}
                    >
                      {questionType === 'mcq' && (
                        <CheckCircle size={16} className="text-white" />
                      )}
                    </div>
                    <span>Multiple Choice Only</span>
                  </div>
                </div>
                
                <div
                  className={`border rounded-md p-3 cursor-pointer ${
                    questionType === 'code'
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-300 hover:border-primary-300'
                  }`}
                  onClick={() => setQuestionType('code')}
                >
                  <div className="flex items-center">
                    <div
                      className={`w-4 h-4 rounded-full mr-2 border ${
                        questionType === 'code'
                          ? 'border-primary-500 bg-primary-500'
                          : 'border-gray-400'
                      }`}
                    >
                      {questionType === 'code' && (
                        <CheckCircle size={16} className="text-white" />
                      )}
                    </div>
                    <span>Coding Questions Only</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Additional Study Materials (Optional)
              </label>
              <div className="flex flex-col items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    {file ? (
                      <p className="mb-2 text-sm text-gray-500">
                        Selected: <span className="font-medium">{file.name}</span>
                      </p>
                    ) : (
                      <>
                        <Upload size={24} className="mb-2 text-gray-400" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">PDF or text files (Optional)</p>
                      </>
                    )}
                  </div>
                  <input
                    id="dropzone-file"
                    type="file"
                    accept=".pdf,.txt"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
                {file && (
                  <button
                    type="button"
                    onClick={() => setFile(null)}
                    className="mt-2 text-sm text-red-600 hover:text-red-700"
                  >
                    Remove file
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => navigate(`/course/${courseId}`)}
              className="px-4 py-2 mr-3 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || isGenerating}
              className="px-4 py-2 text-white bg-primary-600 rounded-md hover:bg-primary-700 disabled:bg-primary-400 flex items-center"
            >
              <FileQuestion size={18} className="mr-2" />
              {loading || isGenerating ? 'Generating...' : 'Generate Quiz'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuizGenerator;