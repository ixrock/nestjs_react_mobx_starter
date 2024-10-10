import { buildApiRequest } from "./buildApiRequest";
import type { QuizId } from "../../server/quiz/quiz.types";
import { AuthLoginResponse, LoggedUserPayload } from "../../server/auth/auth.types";

export * from "./apiToken.storage";
export * from "./buildApiRequest";

// Backend api-helpers

// auth.controller.ts
export function authLoginApi() {
  return buildApiRequest<AuthLoginResponse>({
    basePath: "/auth/login",
    method: "POST"
  });
}

export function loggedUserApi() {
  return buildApiRequest<LoggedUserPayload>({
    basePath: "/auth/user"
  });
}

// quiz.controller.ts

// TODO: add valid api-responses types from server apis
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
