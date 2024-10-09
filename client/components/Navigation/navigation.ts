import { createObservableHistory } from "mobx-observable-history";
import type { QuizId } from "../../../server/quiz/quiz.types";

export const navigation = createObservableHistory();

export enum PageId {
  LOGIN = "login",
  QUIZ = "quiz",
  QUIZ_RESULT = "quiz_result",
}

export interface PageParams {
  pageId: PageId;
}

export interface LoginPageParams extends PageParams {
  pageId: PageId.LOGIN;
}

export interface QuizPageParams extends PageParams {
  pageId: PageId.QUIZ;
  quizId: QuizId;
}

export interface QuizResultsPageParams extends PageParams {
  pageId: PageId.QUIZ_RESULT;
  quizId: QuizId;
}

export type BuildRouteHelper<Params extends PageParams> = ReturnType<typeof buildRoute<Params>>;

export function buildRoute<Params extends PageParams>(routePath: string, defaultParams: Partial<Params> = {}) {
  return {
    routePath,

    toURLPath(params: Params): string {
      return routePath.replace(/:(\w+)/g, (_, key: keyof PageParams) => params[key]);
    },

    getParams(pathname: string): Params {
      const parsedParams = {} as Params;
      const pathParams = pathname.split("/");

      routePath.split("/").forEach((pathChunk, pathIndex) => {
        if (pathChunk.startsWith(":")) {
          const paramName = pathChunk.substring(1) as keyof Params; // parametrized route-param, e.g. from "/users/:userId"
          const paramValue = pathParams[pathIndex] ?? defaultParams[paramName];
          parsedParams[paramName] = paramValue as Params[keyof Params];
        }
      });

      return parsedParams;
    }
  };
}
