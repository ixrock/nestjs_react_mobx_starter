import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthPostDto } from "./auth.types";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {
  }

  @Post()
  async login(@Body() { username, password }: AuthPostDto) {
    return this.authService.login(username, password);
  }
}
