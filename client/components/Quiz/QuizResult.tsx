import * as styles from "./QuizResult.module.css";
import React from "react";
import { observer } from "mobx-react";
import { cssNames, IClassName } from "../../utils";
import { QuizResultRouteParams, RouteComponentParams } from "../Navigation";
import { flow, makeObservable, observable } from "mobx";
import { QuizResultType } from "../../../server/quiz/quiz.types";
import { ApiError, quizResultApi } from "../../apis";
import { SubTitle } from "../SubTitle";

export interface QuizResultProps extends RouteComponentParams<QuizResultRouteParams> {
  className?: IClassName;
}

@observer
export class QuizResult extends React.Component<QuizResultProps> {
  public quizResult: QuizResultType;
  public error = "";

  constructor(props: QuizResultProps) {
    super(props);
    makeObservable(this, {
      loadQuizResult: flow,
      quizResult: observable.ref,
      error: observable
    });
  }

  get quizId() {
    return this.props.params.get().quizId;
  }

  componentDidMount() {
    this.loadQuizResult();
  }

  * loadQuizResult() {
    try {
      this.quizResult = yield quizResultApi(this.quizId).request();
    } catch (err: ApiError | unknown) {
      this.error = String(err);
    }
  }

  renderQuizResultNotAvailable() {
    return (
      <div className={styles.QuizResultNotFound}>
        Quiz <em>ID="{this.quizId}"</em> not available due: {this.error}
      </div>
    );
  }

  render() {
    const { quizResult, error, props } = this;

    if (!quizResult) {
      if (error) return this.renderQuizResultNotAvailable();
      return "Loading quiz result..";
    }

    return (
      <div className={cssNames(styles.QuizResult, props.className)}>
        <SubTitle>Quiz results for "{quizResult.quizName}"</SubTitle>

        <pre>{JSON.stringify(this.quizResult, null, 2)}</pre>
      </div>
    );
  }
}
