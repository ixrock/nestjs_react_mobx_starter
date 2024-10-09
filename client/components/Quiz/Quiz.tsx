import * as styles from "./Quiz.module.css";
import React from "react";
import { observer } from "mobx-react";
import type { Question, Quiz as QuizType } from "../../../server/quiz/quiz.types";
import quizMock from "../../../server/quiz/quiz.mock";
import { cssNames, IClassName } from "../../utils";
import QuizIconSvg from "../../assets/icons/puzzle-piece-02.svg";
import { Icon } from "../Icon";
import { ProgressLine } from "../ProgressLine";
import { Button } from "../Button";
import { SubTitle } from "../SubTitle";

export interface QuizProps {
  className?: IClassName;
  data: QuizType;
}

@observer
export class Quiz extends React.Component<QuizProps> {
  static defaultProps: QuizProps = {
    data: quizMock
  };

  renderQuestions(questions: Question[]) {
    return <>
      {questions.map(({ id, question, choices }) => (
        <div key={id} className={styles.question}>
          <SubTitle>{question}</SubTitle>
          <div className={styles.questionChoices}>
            {Object.entries(choices).map(([choiceId, choice]) => {
              return (
                <Button
                  key={choiceId}
                  primary={true}
                  className={styles.questionChoiceButton}
                  label={choice}
                />
              );
            })}
          </div>
        </div>
      ))}
    </>;
  }

  render() {
    const { className, data } = this.props;
    const { quizName, questions } = data;

    return (
      <div className={cssNames(styles.Quiz, className)}>
        <div className={styles.quizHeader}>
          <Icon big svgContent={QuizIconSvg} className={styles.quizIcon} />
          <h2>{quizName}</h2>
        </div>

        <div className={styles.progress}>
          <ProgressLine className={styles.progressLine} min={1} max={4} value={questions.length} />
          <div className={styles.progressRemainInfo}>
            {questions.length}/4 questions remain
          </div>
        </div>

        {this.renderQuestions(questions)}

        <div className={styles.quitOrContinue}>
          <Button label="End quiz and exit" />
          <Button label="&rarr; Continue quiz" primary />
        </div>
      </div>
    );
  }
}
