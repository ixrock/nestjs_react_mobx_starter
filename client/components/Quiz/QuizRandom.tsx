import React from "react";
import { observer } from "mobx-react";
import { quizRoute, QuizRouteParams, RouteComponentParams, RouteStorePreload } from "@/components/Navigation";
import type { QuizType } from "#/quiz/quiz.types";

export interface QuizRandomProps extends RouteComponentParams<QuizRouteParams>, RouteStorePreload<QuizType> {
}

@observer
export class QuizRandom extends React.Component<QuizRandomProps> {
  redirectCheck() {
    const { data: quiz } = this.props;
    if (quiz) {
      quizRoute.navigate({ quizId: quiz.quizId });
    }
  }

  componentDidUpdate() {
    this.redirectCheck();
  }

  async componentDidMount() {
    this.redirectCheck();
  }

  render() {
    const { error, isLoading } = this.props;
    if (error) return <em>Quiz not available: {String(error)}</em>;
    if (isLoading) return <em>Obtaining random quiz...</em>;
  }
}
