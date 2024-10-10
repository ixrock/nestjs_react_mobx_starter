import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { QuizService } from "./quiz.service";
import { GetUser } from "../users/user.decorator";
import { QuizAnswer, QuizId } from "./quiz.types";
import { AuthGuard } from "../auth/auth.guard";

@UseGuards(AuthGuard)
@Controller({
  path: "user/quiz",
  version: "1"
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
    return this.quizService.findResult(user, quizId);
  }

  @Post(":quizId/submit")
  submit(
    @GetUser() user: string,
    @Param("quizId") quizId: QuizId,
    @Body() data: QuizAnswer[]
  ) {
    return this.quizService.submitQuiz({
      userName: user,
      quizId,
      answers: data
    });
  }
}
