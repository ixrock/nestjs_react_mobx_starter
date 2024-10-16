import { Body, Controller, Get, NotFoundException, Param, Post, UseGuards } from "@nestjs/common";
import { QuizService } from "./quiz.service";
import { GetUser } from "../users/user.decorator";
import { QuizErrorMessage, QuizErrorStatus, QuizId, QuizSubmitDto } from "./quiz.types";
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
    const randomQuiz = await this.quizService.findRandomQuiz(user);

    if (randomQuiz) return randomQuiz;

    throw new NotFoundException({
      message: QuizErrorMessage.QUIZ_NOT_FOUND,
      status: QuizErrorStatus.NOT_FOUND
    });
  }

  @Get(":quizId")
  async getQuiz(
    @Param("quizId") quizId: QuizId
  ) {
    const quiz = await this.quizService.findQuizBy(quizId);

    if (quiz) return quiz;

    throw new NotFoundException({
      message: QuizErrorMessage.QUIZ_NOT_FOUND,
      status: QuizErrorStatus.NOT_FOUND
    });
  }

  @Get(":quizId/result")
  async getQuizResult(
    @GetUser() user: string,
    @Param("quizId") quizId: QuizId
  ) {
    return this.quizService.findQuizResult(user, quizId);
  }

  @Post(":quizId/submit")
  async submitQuiz(
    @GetUser() userName: string,
    @Param("quizId") quizId: QuizId,
    @Body() data: QuizSubmitDto
  ) {
    return this.quizService.submitQuiz(userName, quizId, data);
  }
}
