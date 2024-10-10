export type QuizId = string;
export type QuestionId = string;

export interface QuizType {
  quizId: QuizId;
  quizName: string;
  imageUrl: string;
  iconUrl: string;
  questions: Question[];
}

export interface Question {
  id: QuestionId;
  question: string;
  choices: Record<string, string>;
  answerType: "SINGLE" | "MULTIPLE";
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
  userName: string;
  quizId: QuizId;
  answers: QuizAnswer[];
}
