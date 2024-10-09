import * as styles from "./Quiz.module.css";
import React from "react";
import { observer } from "mobx-react";
import { cssNames, IClassName } from "../../utils";
import { type Quiz as QuizType } from "../../../server/quiz/quiz.types";

export interface QuizProps {
  className?: IClassName;
  data: QuizType;
}

@observer
export class Quiz extends React.Component<QuizProps> {
  render() {
    const { className } = this.props;

    return (
      <div className={cssNames(styles.Quiz, className)}>

      </div>
    );
  }
}
