import * as styles from "./Quiz.module.css";
import React from "react";
import { observer } from "mobx-react";
import { action, computed, makeObservable, observable, reaction, runInAction } from "mobx";
import { AnswerId, AnswerType, Question, QuestionId, QuizAnswer, QuizId, QuizType } from "../../../server/quiz/quiz.types";
import { cssNames, disposer, IClassName } from "../../utils";
import QuizIconSvg from "../../assets/icons/puzzle-piece-02.svg";
import { Icon } from "../Icon";
import { ProgressLine } from "../ProgressLine";
import { Button } from "../Button";
import { SubTitle } from "../SubTitle";
import { QuizRouteParams, quizRouteResult, RouteComponentParams } from "../Navigation";
import { ApiError, quizApi, quizSubmitApi } from "../../apis";

export interface QuizProps extends RouteComponentParams<QuizRouteParams> {
  className?: IClassName;
}

@observer
export class Quiz extends React.Component<QuizProps> {
  constructor(props: QuizProps) {
    super(props);
    makeObservable(this);
    this.bindDataLoader();
  }

  private disposer = disposer();

  @observable.ref quiz?: QuizType;
  @observable isLoading = false;
  @observable error = "";
  @observable submitError = "";
  @observable answers: Record<QuestionId, AnswerId[]> = {};

  get quizId() {
    return this.props.params.get().quizId;
  }

  @computed get questionsCount(): number {
    return this.quiz?.questions.length ?? 0;
  }

  @computed get answeredQuestionsCount(): number {
    return Object.values(this.answers)
      .filter(answers => answers.length > 0)
      .length;
  }

  @computed get remainQuestionsCount(): number {
    return this.questionsCount - this.answeredQuestionsCount;
  }

  @computed get submitAllowed(): boolean {
    return this.answeredQuestionsCount === this.questionsCount;
  }

  componentWillUnmount() {
    this.disposer();
  }

  private bindDataLoader() {
    const { params } = this.props;

    const disposer = reaction(
      () => params.get(),
      ({ quizId }) => this.preloadQuiz(quizId),
      {
        delay: 100,
        fireImmediately: true
      }
    );

    this.disposer.push(disposer);
  }

  @action
  preloadQuiz(quizId: QuizId) {
    this.error = "";
    this.isLoading = true;

    // TODO: probably move handling Route related api data-layer to <Router> + use global state via `appStore`
    return quizApi(quizId).request()
      .then(action(quiz => this.quiz = quiz))
      .catch(action(error => this.error = String(error)))
      .finally(action(() => this.isLoading = false));
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

  // TODO: try to handle auth-errors from views at global level somehow
  renderQuizNotAvailable() {
    return (
      <div className={styles.QuizNotFound}>
        Quiz <em>ID="{this.quizId}"</em> not available: {this.error}
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
      quiz, error, onEndQuiz, onSubmitQuiz, submitAllowed, submitError,
      answeredQuestionsCount, remainQuestionsCount, questionsCount
    } = this;

    if (!quiz) {
      if (error) return this.renderQuizNotAvailable(); // e.g. auth-error or not found
      return "Loading quiz...";
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
