import type React from "react";
import { IComputedValue } from "mobx";
import type { QuizId } from "../../../server/quiz/quiz.types";
import { buildRoute, RouteHelper } from "./navigation";

export interface AppRoute<Params extends RouteParams = RouteParams> {
  route: RouteHelper<Params>;
  Component: React.ComponentType<RouteComponentParams<Params>>;

  // render inside app's root element
  noWrap?: boolean;

  // default route when nothing is matched
  isDefault?: boolean;

  // when specified provides data/error/loading state for active route,
  // to get access from props extend with `RouteStore` interface.
  preload?: (params: Params) => Promise<any>;
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
export const homeRoute = buildRoute("/");
export const loginRoute = buildRoute<LoginRouteParams>("/login");
export const quizRandomRoute = buildRoute(`/quiz/random`);
export const quizRoute = buildRoute<QuizRouteParams>("/quiz/:quizId");
export const quizRouteResult = buildRoute<QuizResultRouteParams>("/quiz/:quizId/result");