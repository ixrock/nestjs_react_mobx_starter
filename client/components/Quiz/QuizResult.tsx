import * as styles from "./QuizResult.module.css";

import React from "react";
import { observer } from "mobx-react";
import { cssNames, IClassName } from "@/utils";
import { QuizResultType } from "#/quiz/quiz.types";
import { QuizResultRouteParams, RouteComponentParams, RouteStorePreload, SubTitle } from "@/components";

export interface QuizResultProps
  extends RouteComponentParams<QuizResultRouteParams>, RouteStorePreload<QuizResultType> {
  className?: IClassName;
}

@observer
export class QuizResult extends React.Component<QuizResultProps> {
  renderQuizResultNotAvailable() {
    const { params: { quizId }, error } = this.props;

    return (
      <div className={styles.QuizResultNotFound}>
        Quiz Results for <em>ID="{quizId}"</em> not available due: {String(error)}
      </div>
    );
  }

  render() {
    const { data: quizResult, error, className, isLoading } = this.props;

    if (!quizResult) {
      if (error) return this.renderQuizResultNotAvailable();
      if (isLoading) return "Loading quiz result..";
      return null;
    }

    return (
      <div className={cssNames(styles.QuizResult, className)}>
        <SubTitle>Quiz results for "{quizResult.quizName}"</SubTitle>

        <pre>{JSON.stringify(quizResult, null, 2)}</pre>
      </div>
    );
  }
}
