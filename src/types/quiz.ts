export type QuestionType = 'mcq' | 'code';

export interface Question {
  title: string;
  context: string;
  topics: string[];
  question_type: QuestionType;
  options: string[];
}

export interface QuizResult {
  correct: boolean;
  correct_option: string;
}

export interface QuizSubmission {
  submission: { answer: string }[];
}