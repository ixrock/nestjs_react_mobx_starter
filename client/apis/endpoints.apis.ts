import { buildApiRequest } from "./buildApiRequest";
import type { QuizId, QuizResultType, QuizSubmitDto, QuizType } from "../../server/quiz/quiz.types";
import type { AuthLoginResponse, LoggedUserPayload } from "../../server/auth/auth.types";

// auth.controller.ts apis

export function authLoginApi() {
  return buildApiRequest<AuthLoginResponse>({
    basePath: "/auth/login",
    method: "POST"
  });
}

export function getUserApi() {
  return buildApiRequest<LoggedUserPayload>({
    basePath: "/auth/user"
  });
}

// quiz.controller.ts apis

export function quizRandomApi() {
  return buildApiRequest<QuizType>({
    basePath: "/user/quiz/random"
  });
}

export function quizApi(quizId: QuizId) {
  return buildApiRequest<QuizType>({
    basePath: `/user/quiz/${quizId}`
  });
}

export function quizResultApi(quizId: QuizId) {
  return buildApiRequest<QuizResultType>({
    basePath: `/user/quiz/${quizId}/result`
  });
}

export function quizSubmitApi(quizId: QuizId) {
  return buildApiRequest<boolean, QuizSubmitDto>({
    method: "POST",
    basePath: `/user/quiz/${quizId}/submit`
  });
}
