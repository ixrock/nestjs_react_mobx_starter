import * as styles from "./Quiz.module.css";
import React from "react";
import { observer } from "mobx-react";
import { action, makeObservable, observable, reaction, runInAction } from "mobx";
import type { Question, QuizId, QuizType } from "../../../server/quiz/quiz.types";
import { cssNames, disposer, IClassName } from "../../utils";
import QuizIconSvg from "../../assets/icons/puzzle-piece-02.svg";
import { Icon } from "../Icon";
import { ProgressLine } from "../ProgressLine";
import { Button } from "../Button";
import { SubTitle } from "../SubTitle";
import { navigation, quizRoute, QuizRouteParams, RouteComponentParams } from "../Navigation";
import { quizApi, quizRandomApi } from "../../apis";
import { QUIZ_RANDOM_ID } from "./quiz.constants";

export interface QuizProps extends RouteComponentParams<QuizRouteParams> {
  className?: IClassName;
}

@observer
export class Quiz extends React.Component<QuizProps> {
  private disposer = disposer();

  @observable.ref quiz?: QuizType;
  @observable isLoading = false;
  @observable error = "";

  constructor(props: QuizProps) {
    super(props);
    makeObservable(this);
    this.bindDataLoader();
  }

  componentWillUnmount() {
    this.disposer();
  }

  // TODO: probably move handling Route related api data-layer to <Router> + use global state from `appStore`
  private bindDataLoader() {
    const { params } = this.props;

    const disposer = reaction(() => params.get(), ({ quizId }) => {
      if (quizId === QUIZ_RANDOM_ID) {
        void this.redirectToRandomQuiz();
      } else if (quizId) {
        void this.preloadQuiz(quizId);
      }
    }, {
      fireImmediately: true
    });

    this.disposer.push(disposer);
  }

  async redirectToRandomQuiz() {
    try {
      const availableQuiz = await quizRandomApi().request();

      if (availableQuiz) {
        navigation.replace(
          quizRoute.toURLPath({ quizId: availableQuiz.quizId })
        );
      }
    } catch (err) {
      runInAction(() => this.error = String(err));
    }
  }

  @action
  preloadQuiz(quizId: QuizId) {
    this.error = "";
    this.isLoading = true;

    return quizApi(quizId).request()
      .then(action(quiz => this.quiz = quiz))
      .catch(action(error => this.error = String(error)))
      .finally(action(() => this.isLoading = false));
  }

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

  renderQuizNotAvailable() {
    const { quizId } = this.props.params.get();

    return (
      <div className={styles.QuizNotFound}>
        Quiz <em>ID="{quizId}"</em> not available: {this.error}
      </div>
    );
  }

  render() {
    const { quiz, error } = this;

    if (!quiz) {
      if (error) return this.renderQuizNotAvailable();
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
