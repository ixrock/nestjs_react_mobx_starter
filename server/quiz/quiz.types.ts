export type QuizId = string;

export type QuestionId = string;

export interface QuizType {
  quizId: QuizId;
  quizName: string;
  imageUrl: string;
  iconUrl: string;
  questions: Question[];
}

export enum AnswerType {
  SINGLE = "SINGLE",
  MULTIPLE = "MULTIPLE",
}

export interface Question {
  id: QuestionId;
  question: string;
  choices: Record<string, string>;
  answerType: AnswerType;
  points: number;
}

export interface QuizResultType {
  quizId: QuizId;
  quizName: string;
  totalScore: number;
  userScore: number;
  resultDetails: QuizResultDetail[];
}

export interface QuizResultDetail {
  questionId: QuestionId;
  question: string;
  correctAnswer: string;
  userAnswer: string;
  isCorrect: boolean;
}

export interface QuizAnswer {
  questionId: QuestionId;
  answers: string[];
}

export interface QuizSubmitDto {
  quizId: QuizId;
  answers: QuizAnswer[];
}
