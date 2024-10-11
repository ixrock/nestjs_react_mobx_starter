import type React from "react";
import type { QuizId } from "../../../server/quiz/quiz.types";
import { buildRoute, RouteHelper } from "./navigation";
import { IComputedValue } from "mobx";

export interface AppRoute<Params extends RouteParams = RouteParams> {
  route: RouteHelper<Params>;
  Component: React.ComponentType<RouteComponentParams<Params>>;
  noWrap?: boolean; // render inside app's root element
}

export interface RouteComponentParams<Params = object> {
  params: IComputedValue<Params>;
}

// Route params
export interface RouteParams {
}

export interface LoginRouteParams extends RouteParams {
}

export interface QuizRouteParams extends RouteParams {
  quizId: QuizId;
}

export interface QuizResultRouteParams extends RouteParams {
  quizId: QuizId;
}

// Routes
export const loginRoute = buildRoute<LoginRouteParams>("/login");
export const quizRoute = buildRoute<QuizRouteParams>("/quiz/:quizId");
export const quizRouteResult = buildRoute<QuizResultRouteParams>("/quiz/:quizId/result");
