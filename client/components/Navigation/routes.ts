import type React from "react";
import { IComputedValue, IObservableValue } from "mobx";
import { buildRoute, BuildRouteHelper, LoginPageParams, PageId, PageParams, QuizPageParams, QuizResultsPageParams } from "./navigation";

export interface AppRoute<Params extends PageParams = PageParams> {
  route: BuildRouteHelper<Params>;
  params: IObservableValue<Params> | IComputedValue<Params>;
  render(params: Params): React.ReactNode;
}

export const loginRoute = buildRoute<LoginPageParams>("/login", {
  pageId: PageId.LOGIN
});

export const quizRoute = buildRoute<QuizPageParams>("/:pageId/quiz/:quizId", {
  pageId: PageId.QUIZ
});

export const quizRouteResult = buildRoute<QuizResultsPageParams>("/:pageId/quiz/results/:quizId", {
  pageId: PageId.QUIZ_RESULT
});
