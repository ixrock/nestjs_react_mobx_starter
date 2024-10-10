import { buildApiRequest } from "./buildApiRequest";
import type { QuizId } from "../../server/quiz/quiz.types";

export * from "./apiToken.storage";
export * from "./buildApiRequest";

// Backend api-helpers

// auth.controller.ts
export function authLoginApi<Response>() {
  return buildApiRequest<Response>({
    basePath: "/auth/login",
    method: "POST"
  });
}

// quiz.controller.ts
export function quizRandomApi() {
  return buildApiRequest({
    basePath: "/user/quiz/random"
  });
}

export function quizApi(quizId: QuizId) {
  return buildApiRequest({
    basePath: `/user/quiz/${quizId}`
  });
}

export function quizSubmitApi(quizId: QuizId) {
  return buildApiRequest({
    method: "POST",
    basePath: `/user/quiz/${quizId}/submit`
  });
}

export function quizResultApi(quizId: QuizId) {
  return buildApiRequest({
    basePath: `/user/quiz/${quizId}/result`
  });
}
