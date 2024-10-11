import * as styles from "./QuizResult.module.css";
import React from "react";
import { observer } from "mobx-react";
import { cssNames, IClassName } from "../../utils";
import { QuizResultRouteParams, RouteComponentParams } from "../Navigation";

export interface QuizResultProps extends RouteComponentParams<QuizResultRouteParams> {
  className?: IClassName;
}

@observer
export class QuizResult extends React.Component<QuizResultProps> {
  render() {
    const { className, params } = this.props;

    return (
      <div className={cssNames(styles.QuizResult, className)}>
        Results for quiz "{params.get().quizId}"
      </div>
    );
  }
}
