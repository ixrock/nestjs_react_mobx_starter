import type React from "react";
import type { QuizId } from "../../../server/quiz/quiz.types";
import { buildRoute, BuildRouteHelper } from "./navigation";

export interface AppRoute<Params extends RouteParams = RouteParams> {
  route: BuildRouteHelper<Params>;
  Component: React.ComponentType<Params | any>;
  topLayout?: boolean; // don't render inside parent's layout component wrapper
}

export enum PageId {
  LOGIN = "login",
  QUIZ = "quiz",
  QUIZ_RESULT = "quiz_result",
}

export interface RouteParams {
  pageId?: PageId;
}

export interface LoginRouteParams extends RouteParams {
  pageId?: PageId.LOGIN;
}

export interface QuizRouteParams extends RouteParams {
  pageId?: PageId.QUIZ;
  quizId: QuizId;
}

export interface QuizResultRouteParams extends RouteParams {
  pageId?: PageId.QUIZ_RESULT;
  quizId: QuizId;
}

// Routes

export const loginRoute = buildRoute<LoginRouteParams>("/login", {
  pageId: PageId.LOGIN
});

export const quizRoute = buildRoute<QuizRouteParams>("/quiz/:quizId", {
  pageId: PageId.QUIZ
});

export const quizRouteResult = buildRoute<QuizResultRouteParams>("/quiz/:quizId/result", {
  pageId: PageId.QUIZ_RESULT
});
