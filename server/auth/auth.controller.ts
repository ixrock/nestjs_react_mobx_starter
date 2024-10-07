import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthLoginDto } from "./auth.types";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {
  }

  @HttpCode(HttpStatus.OK)
  @Post("login")
  async login(@Body() { username, password }: AuthLoginDto) {
    return this.authService.login(username, password);
  }
}
