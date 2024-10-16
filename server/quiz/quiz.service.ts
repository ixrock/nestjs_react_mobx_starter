import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { QuizAnswer, QuizErrorMessage, QuizErrorStatus, QuizId, QuizResultDetail, QuizResultType, QuizSubmitDto, QuizType } from "./quiz.types";
import generateQuizMock from "./quiz.mock";

@Injectable()
export class QuizService {
  // generate quiz mocks
  private quizList: QuizType[] = Array.from({ length: 10 }).map(() => {
    return generateQuizMock({
      questionsNum: Math.floor(Math.random() * 3) + 2,
      choicesNum: Math.floor(Math.random() * 2) + 2,
      points: Math.ceil(Math.random() * 10)
    });
  });

  // for the sake of simplicity, we keep quiz results in memory:
  // in real world scenario this should be provided from a database, e.g. with "@nestjs/typeorm"
  private quizResultsPerUser: Record<string, Record<QuizId, QuizAnswer[]>> = {};

  async findQuizBy(id: QuizId): Promise<QuizType | undefined> {
    return this.quizList.find(quiz => quiz.quizId === id);
  }

  async findRandomQuiz(userName: string): Promise<QuizType> {
    const answeredQuizIds = Object.keys(this.quizResultsPerUser[userName] || {});
    const availableQuizList = this.quizList.filter(quiz => !answeredQuizIds.includes(quiz.quizId));

    if (availableQuizList.length > 0) {
      return availableQuizList[Math.floor(Math.random() * availableQuizList.length)];
    }
  }

  async findQuizResult(userName: string, quizId: QuizId): Promise<QuizResultType> {
    const quiz = await this.findQuizBy(quizId);
    const answers = this.quizResultsPerUser[userName]?.[quizId];

    if (!quiz || !answers) {
      throw new NotFoundException({
        message: QuizErrorMessage.QUIZ_RESULT_NOT_FOUND,
        status: QuizErrorStatus.NOT_FOUND,
        traceId: quizId
      });
    }

    const resultDetails: QuizResultDetail[] = quiz.questions.map(({ id: questionId, choices, question, points }) => {
      const { answers: questionAnswers } = answers.find(answer => answer.questionId === questionId);

      // FIXME: fake correct answer generated on each request
      const correctAnswer = String(Math.floor(Math.random() * Object.keys(choices).length));

      return {
        questionId,
        question,
        correctAnswer,
        userAnswer: questionAnswers.join(", "),
        isCorrect: questionAnswers.includes(correctAnswer)
      };
    });

    const totalScore = quiz.questions.reduce((score, { points }) => score + points, 0);

    const userScore = resultDetails.reduce((score, { questionId, isCorrect }) => {
      const question = quiz.questions.find(({ id }) => id === questionId);
      return score + (isCorrect ? question.points : 0);
    }, 0);

    return {
      quizId,
      quizName: quiz.quizName,
      totalScore,
      userScore,
      resultDetails
    };
  }

  async submitQuiz(userName: string, quizId: QuizId, payload: QuizSubmitDto): Promise<boolean> {
    const quizExists = Boolean(await this.findQuizBy(quizId));

    // TODO: basic validation, maybe better to move to guard or pipe
    if (!quizExists || !userName || !payload?.answers) {
      throw new BadRequestException({
        message: QuizErrorMessage.QUIZ_INVALID_PARAMS,
        status: QuizErrorStatus.PRECONDITION_FAILED
      });
    }

    this.quizResultsPerUser[userName] ??= {};

    const userHasAnswersForTheQuiz = this.quizResultsPerUser[userName][quizId];
    if (userHasAnswersForTheQuiz) {
      throw new HttpException({
        status: QuizErrorStatus.PRECONDITION_FAILED,
        message: QuizErrorMessage.QUIZ_ALREADY_TAKEN,
        traceId: quizId
      }, HttpStatus.UNPROCESSABLE_ENTITY);
    }

    this.quizResultsPerUser[userName][quizId] = payload.answers;
    return true;
  }
}
