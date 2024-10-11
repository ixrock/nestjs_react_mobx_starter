import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { UsersService } from "../users/users.service";
import { AuthLoginResponse, AuthSignPayload } from "./auth.types";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {
  }

  async login(username: string, password: string): Promise<AuthLoginResponse> {
    const existingUser = await this.usersService.verify(username, password);

    if (!existingUser) {
      throw new UnauthorizedException();
    }

    const payload: AuthSignPayload = { username };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>("JWT_SECRET"),
      expiresIn: this.configService.get<string>("JWT_EXPIRES_IN", "1h"),
    });

    return {
      accessToken
    };
  }
}
