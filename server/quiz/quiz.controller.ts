import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { QuizService } from "./quiz.service";
import { GetUser } from "../users/user.decorator";
import { QuizAnswer, QuizId, QuizSubmitDto } from "./quiz.types";
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
  getRandom(@GetUser() user: string) {
    return this.quizService.findAvailableQuiz(user);
  }

  @Get(":quizId/result")
  getResult(
    @GetUser() user: string,
    @Param("quizId") quizId: QuizId
  ) {
    return this.quizService.findQuizResult(user, quizId);
  }

  @Post(":quizId/submit")
  submit(
    @GetUser() userName: string,
    @Body() data: QuizSubmitDto
  ) {
    return this.quizService.submitQuiz(userName, data);
  }
}
