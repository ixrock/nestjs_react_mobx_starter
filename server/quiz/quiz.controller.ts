import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, UseGuards } from "@nestjs/common";
import { QuizService } from "./quiz.service";
import { GetUser } from "../users/user.decorator";
import { QuizId, QuizSubmitDto } from "./quiz.types";
import { AuthGuard } from "../auth/auth.guard";

@UseGuards(AuthGuard)
@Controller({
  version: "1",
  path: "user/quiz"
})
export class QuizController {
  constructor(
    private quizService: QuizService
  ) {
  }

  @Get("random")
  async getRandom(@GetUser() user: string) {
    const randomQuiz = await this.quizService.findAvailableQuiz(user);

    if (randomQuiz) return randomQuiz;

    throw new HttpException({
      status: "NOT_FOUND",
      message: "QUIZ_NOT_FOUND"
    }, HttpStatus.NOT_FOUND);
  }

  @Get(":quizId")
  async getQuiz(
    @GetUser() user: string,
    @Param("quizId") quizId: QuizId
  ) {
    const quiz = await this.quizService.findQuizBy(quizId);

    if (quiz) return quiz;

    throw new HttpException({
      status: "NOT_FOUND",
      message: "QUIZ_NOT_FOUND"
    }, HttpStatus.NOT_FOUND);
  }

  @Get(":quizId/result")
  async getQuizResult(
    @GetUser() user: string,
    @Param("quizId") quizId: QuizId
  ) {
    const quizResult = await this.quizService.findQuizResult(user, quizId);

    if (quizResult) return quizResult;

    throw new HttpException({
      status: "NOT_FOUND",
      message: "QUIZ_RESULT_NOT_FOUND",
      traceId: quizId
    }, HttpStatus.NOT_FOUND);
  }

  @Post(":quizId/submit")
  async submitQuiz(
    @GetUser() userName: string,
    @Param("quizId") quizId: QuizId,
    @Body() data: QuizSubmitDto
  ) {
    const success = await this.quizService.submitQuiz(userName, data);

    if (!success) {
      throw new HttpException({
        "status": "PRECONDITION_FAILED",
        "message": "QUIZ_ALREADY_TAKEN",
        "traceId": quizId
      }, HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }
}
