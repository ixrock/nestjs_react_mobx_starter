import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { QuizAnswer, QuizErrorMessage, QuizErrorStatus, QuizId, QuizResultType, QuizSubmitDto, QuizType } from "./quiz.types";
import generateQuizMock from "./quiz.mock";

@Injectable()
export class QuizService {
  // generate 10 random quiz mocks
  private quizList: QuizType[] = Array.from({ length: 10 }).map(() => {
    return generateQuizMock({
      questionsNum: Math.floor(Math.random() * 3) + 2,
      choicesNum: Math.floor(Math.random() * 2) + 2,
      points: Math.ceil(Math.random() * 3)
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

    // FIXME: fake score calculations
    return {
      quizId,
      quizName: quiz.quizName,
      totalScore: 100,
      userScore: 50,
      resultDetails: answers.map(({ questionId, answers }) => {
        const question = quiz.questions.find(question => question.id === questionId);
        return {
          questionId,
          question: question.question,
          correctAnswer: "1",
          userAnswer: answers.join(","),
          isCorrect: true
        };
      })
    };
  }

  async submitQuiz(userName: string, quizId: QuizId, payload: QuizSubmitDto): Promise<boolean> {
    const quizExists = Boolean(await this.findQuizBy(quizId));

    // TODO: basic validation, better to move to guard or pipe probably
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
