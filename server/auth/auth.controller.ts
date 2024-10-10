import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthLoginDto, LoggedUserPayload } from "./auth.types";
import { GetUser } from "../users/user.decorator";
import { AuthGuard } from "./auth.guard";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {
  }

  @UseGuards(AuthGuard)
  @Get("user")
  async loggedUser(@GetUser() user: string): Promise<LoggedUserPayload> {
    return {
      username: user
    };
  }

  @HttpCode(HttpStatus.OK)
  @Post("login")
  async login(@Body() { username, password }: AuthLoginDto) {
    return this.authService.login(username, password);
  }
}
