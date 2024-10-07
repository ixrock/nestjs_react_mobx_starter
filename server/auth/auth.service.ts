import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
import { AuthValidResponse } from "./auth.types";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {
  }

  async login(username: string, password: string): Promise<AuthValidResponse> {
    const existingUser = await this.usersService.verify(username, password);

    if (!existingUser) {
      throw new UnauthorizedException();
    }

    return {
      accessToken: await this.jwtService.signAsync({ username })
    };
  }
}
