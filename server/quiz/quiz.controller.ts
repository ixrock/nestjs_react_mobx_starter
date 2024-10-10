import { Body, Controller, Get, Param, Post, UseGuards, Version } from "@nestjs/common";
import { QuizService } from "./quiz.service";
import { GetUser } from "../users/user.decorator";
import { User } from "../users/users.service";
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
  getRandom(@GetUser() user: User) {
    return this.quizService.findAvailableQuiz(user?.username ?? "admin");
  }

  @Get(":quizId/result")
  getResult(
    @GetUser() user: User,
    @Param("quizId") quizId: QuizId
  ) {
    return this.quizService.findResult(user.username, quizId);
  }

  @Post(":quizId/submit")
  submit(
    @GetUser() user: User,
    @Param("quizId") quizId: QuizId,
    @Body() data: QuizAnswer[]
  ) {
    return this.quizService.submitQuiz({
      userName: user.username,
      quizId,
      answers: data
    });
  }
}
