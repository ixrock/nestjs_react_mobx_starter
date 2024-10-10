import { buildApiRequest } from "./buildApiRequest";
import type { QuizId } from "../../server/quiz/quiz.types";

export * from "./apiToken.storage";
export * from "./buildApiRequest";

// Backend api-helpers

// auth.controller.ts
export const quizLoginApi = () => buildApiRequest({
  basePath: "/auth/login",
  method: "POST"
});

// quiz.controller.ts
export const quizRandomApi = () => buildApiRequest({
  basePath: "/user/quiz/random"
});

export const quizApi = (quizId: QuizId) => buildApiRequest({
  basePath: `/user/quiz/${quizId}`
});

export const quizSubmitApi = (quizId: QuizId) => buildApiRequest({
  method: "POST",
  basePath: `/user/quiz/${quizId}/submit`
});

export const quizResultApi = (quizId: QuizId) => buildApiRequest({
  basePath: `/user/quiz/${quizId}/result`
});
