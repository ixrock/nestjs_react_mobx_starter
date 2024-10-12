import React from "react";
import { makeObservable, observable, runInAction } from "mobx";
import { observer } from "mobx-react";
import { quizRoute, QuizRouteParams, RouteComponentParams } from "../Navigation";
import { ApiError, quizRandomApi } from "../../apis";

export interface QuizRandomProps extends RouteComponentParams<QuizRouteParams> {
}

@observer
export class QuizRandom extends React.Component<QuizRandomProps> {
  @observable error = "";

  constructor(props: QuizRandomProps) {
    super(props);
    makeObservable(this);
    void this.redirectToRandomQuiz();
  }

  async redirectToRandomQuiz() {
    try {
      const availableQuiz = await quizRandomApi().request();

      if (availableQuiz) {
        quizRoute.navigate({ quizId: availableQuiz.quizId });
      }
    } catch (err: ApiError | unknown) {
      runInAction(() => this.error = String(err));
    }
  }

  render() {
    return (
      <em>Quiz not available: {this.error}</em>
    );
  }
}
