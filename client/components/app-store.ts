import { observable } from "mobx";
import { loggedUserApi } from "../apis";
import { QuizResultType, QuizType } from "../../server/quiz/quiz.types";
import { LoggedUserPayload } from "../../server/auth/auth.types";

export interface AppStore {
  user?: LoggedUserPayload;
  quiz?: QuizType;
  quizResult?: QuizResultType;
}

export const appStore: AppStore = observable.object({});

export async function initAppStore() {
  try {
    appStore.user = await loggedUserApi().request().catch(() => null);
  } catch (err) {
    console.log("ERR", err);
  }
}

export function logoutAppStore() {
  delete appStore.user;
}
