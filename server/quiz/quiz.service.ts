import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { QuizType, QuizAnswer, QuizId, QuizResultType, QuizSubmitDto } from "./quiz.types";
import quizMockJson from "./quiz.mock";

@Injectable()
export class QuizService {
  // TODO: use some fake-data generator for quiz list or add more hardcoded to the mock list
  // for the sake of simplicity we keep quiz list hardcoded here:
  private quizList: QuizType[] = [quizMockJson];

  // for the sake of simplicity, we keep quiz results in memory:
  // in real world scenario this should be provided from a database, e.g. with "@nestjs/typeorm"
  private quizResultsPerUser: Record<string, Record<QuizId, QuizAnswer[]>> = {};

  async findQuizBy(id: QuizId): Promise<QuizType | undefined> {
    return this.quizList.find(quiz => quiz.quizId === id);
  }

  async findAvailableQuiz(userName: string): Promise<QuizType> {
    const answeredQuizIds = Object.keys(this.quizResultsPerUser[userName] || {});
    const availableQuizList = this.quizList.filter(quiz => !answeredQuizIds.includes(quiz.quizId));

    if (availableQuizList.length > 0) {
      return availableQuizList[Math.floor(Math.random() * availableQuizList.length)];
    }

    throw new HttpException({
      "status": "PRECONDITION_FAILED",
      "message": "QUIZ_ALREADY_TAKEN",
      "traceId": "91b04b58543b84c9"
    }, HttpStatus.NOT_FOUND);
  }

  async findQuizResult(userName: string, quizId: QuizId): Promise<QuizResultType> {
    const quiz = await this.findQuizBy(quizId);
    const answers = this.quizResultsPerUser[userName]?.[quizId];

    if (!quiz || !answers) {
      throw new HttpException({
        status: "NOT_FOUND",
        message: "QUIZ_RESULT_NOT_FOUND",
        traceId: quizId
      }, HttpStatus.NOT_FOUND);
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
          userAnswer: answers.join(", "),
          isCorrect: true
        };
      })
    };
  }

  async submitQuiz(userName: string, { quizId, answers }: QuizSubmitDto) {
    this.quizResultsPerUser[userName] ??= {};

    const userHasAnswersForTheQuiz = this.quizResultsPerUser[userName][quizId];
    if (userHasAnswersForTheQuiz) {
      throw new HttpException({
        "status": "PRECONDITION_FAILED",
        "message": "QUIZ_ALREADY_TAKEN",
        "traceId": quizId
      }, HttpStatus.UNPROCESSABLE_ENTITY);
    }

    this.quizResultsPerUser[userName][quizId] = answers;
  }
}
