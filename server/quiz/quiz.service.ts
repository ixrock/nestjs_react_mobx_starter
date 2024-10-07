import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Quiz, QuizAnswer, QuizId, QuizResult, QuizSubmitDto } from "./quiz.types";
import quizMockJson from "./quiz.mock";

@Injectable()
export class QuizService {
  // for the sake of simplicity we keep quiz list hardcoded here:
  private quizList: Quiz[] = [quizMockJson as Quiz];

  // for the sake of simplicity, we keep quiz results in memory:
  // in real world scenario this should be provided from a database, e.g. with "@nestjs/typeorm"
  private quizResultsPerUser: Record<string, Record<QuizId, QuizAnswer[]>> = {};

  findQuizBy(id: QuizId): Quiz | undefined {
    return this.quizList.find(quiz => quiz.quizId === id);
  }

  findAvailableQuiz(userName: string): Quiz {
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

  findResult(userName: string, quizId: QuizId): QuizResult {
    const answers = this.quizResultsPerUser[userName]?.[quizId];

    if (!answers) {
      throw new HttpException({
        status: "NOT_FOUND",
        message: "QUIZ_RESULT_NOT_FOUND",
        traceId: quizId
      }, HttpStatus.NOT_FOUND);
    }

    const quiz = this.findQuizBy(quizId);

    return {
      quizId,
      quizName: quiz.quizName,
      totalScore: 100, // FIXME: fake total score calculation
      userScore: 50, // FIXME: fake score calculation
      resultDetails: answers.map(({ questionId, answers }) => {
        const question = quiz.questions.find(question => question.id === questionId);
        return {
          questionId,
          question: question.question,
          correctAnswer: "1", // FIXME: fake correct answer
          userAnswer: answers.join(", "),
          isCorrect: true
        };
      })
    };
  }

  submitQuiz({ userName, quizId, answers }: QuizSubmitDto) {
    if (this.quizResultsPerUser[quizId]) {
      throw new HttpException({
        "status": "PRECONDITION_FAILED",
        "message": "QUIZ_ALREADY_TAKEN",
        "traceId": quizId
      }, HttpStatus.UNPROCESSABLE_ENTITY);
    }

    this.quizResultsPerUser[userName] ??= {};
    this.quizResultsPerUser[userName][quizId] = answers;
  }
}
