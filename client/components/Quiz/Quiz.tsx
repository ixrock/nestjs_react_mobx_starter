import * as styles from "./Quiz.module.css";

import React from "react";
import { observer } from "mobx-react";
import { action, makeObservable, observable, runInAction } from "mobx";
import { cssNames, IClassName } from "../../utils";
import { QuizRouteParams, quizRouteResult, RouteComponentParams, RouteStorePreload } from "../Navigation";
import { AnswerId, AnswerType, Question, QuestionId, QuizAnswer, QuizType } from "../../../server/quiz/quiz.types";
import { ApiError, quizSubmitApi } from "../../apis";
import QuizIconSvg from "../../assets/icons/puzzle-piece-02.svg";
import { Icon } from "../Icon";
import { ProgressLine } from "../ProgressLine";
import { Button } from "../Button";
import { SubTitle } from "../SubTitle";

export interface QuizProps
  extends RouteComponentParams<QuizRouteParams>, RouteStorePreload<QuizType> {
  className?: IClassName;
}

@observer
export class Quiz extends React.Component<QuizProps> {
  @observable submitError = "";
  @observable answers: Record<QuestionId, AnswerId[]> = {};

  constructor(props: QuizProps) {
    super(props);
    makeObservable(this);
  }

  get quizId() {
    return this.props.params.get().quizId;
  }

  get quiz(): QuizType | undefined {
    return this.props.data;
  }

  get questionsCount(): number {
    return this.quiz?.questions.length ?? 0;
  }

  get answeredQuestionsCount(): number {
    return Object.values(this.answers)
      .filter(answers => answers.length > 0)
      .length;
  }

  get remainQuestionsCount(): number {
    return this.questionsCount - this.answeredQuestionsCount;
  }

  get submitAllowed(): boolean {
    return this.answeredQuestionsCount === this.questionsCount;
  }

  renderQuestions(questions: Question[]) {
    return <>
      {questions.map((question) => {
        const { id: questionId, question: questionTitle, choices, answerType } = question;

        const multiChoiceIndicator = answerType === AnswerType.MULTIPLE
          ? <span style={{ cursor: "help" }} title="Multiple choices are expected">*</span>
          : "";

        return (
          <div key={questionId} className={styles.question}>
            <SubTitle>{questionTitle}<big>{multiChoiceIndicator}</big></SubTitle>
            <div className={styles.questionChoices}>
              {Object.entries(choices).map(([choiceId, choice]) => {
                const isSelected = this.answers[questionId]?.includes(choiceId);
                const btnClassName = cssNames(styles.questionChoiceButton, {
                  [styles.selectedChoice]: isSelected
                });
                return (
                  <Button
                    primary
                    key={choiceId}
                    label={choice}
                    className={btnClassName}
                    onClick={() => this.onAnswer(question, choiceId)}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </>;
  }

  renderQuizNotAvailable() {
    return (
      <div className={styles.QuizNotFound}>
        Quiz <em>ID="{this.quizId}"</em> not available due: {String(this.props.error)}
      </div>
    );
  }

  @action.bound
  onAnswer(question: Question, answerId: AnswerId) {
    this.answers[question.id] ??= [];

    const answers = this.answers[question.id];
    const existingAnswerIndex = answers.indexOf(answerId);
    const isFreshAnswer = existingAnswerIndex === -1;
    const multipleChoices = question.answerType === AnswerType.MULTIPLE;

    // toggle (remove previous choice)
    if (!isFreshAnswer) {
      answers.splice(existingAnswerIndex, 1);
    } else {
      // handle multiple and single choices
      if (!multipleChoices) answers.length = 0;
      answers.push(answerId);
    }
  }

  @action.bound
  async onSubmitQuiz() {
    this.submitError = ""; // reset if any
    try {
      const answers: QuizAnswer[] = Object
        .entries(this.answers)
        .map(([questionId, answers]) => ({ questionId, answers }));

      // send data to server
      await quizSubmitApi(this.quizId).request({
        data: {
          answers
        }
      });
      // redirect to quiz result page in case of success
      quizRouteResult.navigate({
        quizId: this.quizId
      });
    } catch (err: ApiError | any) {
      runInAction(() => {
        this.submitError = `Failed to submit quiz: ${err.message}`;
      });
    }
  };

  @action.bound
  onEndQuiz() {
    console.log("End quiz. Logout?");
  };

  render() {
    const {
      props: { isLoading, error },
      quiz, onEndQuiz, onSubmitQuiz, submitAllowed, submitError,
      answeredQuestionsCount, remainQuestionsCount, questionsCount
    } = this;

    if (!quiz) {
      if (error) return this.renderQuizNotAvailable(); // e.g. auth-error or not found
      if (isLoading) return "Loading quiz...";
      return null;
    }

    const { quizName, questions } = quiz;

    return (
      <div className={cssNames(styles.Quiz, this.props.className)}>
        <div className={styles.quizHeader}>
          <Icon big svgContent={QuizIconSvg} className={styles.quizIcon} />
          <h2>{quizName}</h2>
        </div>

        <div className={styles.progress}>
          <ProgressLine
            className={styles.progressLine}
            max={questionsCount}
            value={answeredQuestionsCount}
          />
          <div className={styles.progressRemainInfo}>
            {remainQuestionsCount}/{questionsCount} questions remain
          </div>
        </div>

        <div className={styles.submitError}>
          {submitError}
        </div>

        {this.renderQuestions(questions)}

        <div className={styles.quitOrContinue}>
          <Button label="End quiz and exit" onClick={onEndQuiz} />
          <Button
            primary
            label="&rarr; Submit quiz"
            disabled={!submitAllowed}
            onClick={onSubmitQuiz}
          />
        </div>
      </div>
    );
  }
}
