import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
import { AuthLoginResponse, AuthSignPayload } from "./auth.types";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {
  }

  async login(username: string, password: string): Promise<AuthLoginResponse> {
    const existingUser = await this.usersService.verify(username, password);

    if (!existingUser) {
      throw new UnauthorizedException();
    }

    const payload: AuthSignPayload = { username };

    return {
      accessToken: await this.jwtService.signAsync(payload)
    };
  }
}
