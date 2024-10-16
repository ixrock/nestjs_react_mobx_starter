export type QuizId = string;
export type QuestionId = string;
export type AnswerId = string;

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
  choices: Record<AnswerId, string>;
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
  answers: AnswerId[];
}

export interface QuizSubmitDto {
  answers: QuizAnswer[];
}

export enum QuizErrorMessage {
  QUIZ_ALREADY_TAKEN = "QUIZ_ALREADY_TAKEN",
  QUIZ_NOT_FOUND = "QUIZ_NOT_FOUND",
  QUIZ_RESULT_NOT_FOUND = "QUIZ_RESULT_NOT_FOUND",
  QUIZ_INVALID_PARAMS = "BAD_REQUEST",
}

export enum QuizErrorStatus {
  PRECONDITION_FAILED = "PRECONDITION_FAILED",
  NOT_FOUND = "NOT_FOUND",
}
