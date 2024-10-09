import * as styles from "./QuizResult.module.css";
import React from "react";
import { observer } from "mobx-react";
import { cssNames, IClassName } from "../../utils";
import type { QuizId } from "../../../server/quiz/quiz.types";

export interface QuizResultProps {
  className?: IClassName;
  quizId: QuizId;
}

@observer
export class QuizResult extends React.Component<QuizResultProps> {
  render() {
    const { className, quizId } = this.props;

    return (
      <div className={cssNames(styles.QuizResult, className)}>
        Progress result  for quiz ID: "${quizId}"
      </div>
    );
  }
}
