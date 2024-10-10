import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import type { AuthSignPayload } from "../auth/auth.types";

export const GetUser = createParamDecorator(
  (data: AuthSignPayload, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    return request.user ?? data; // get auth user's JWT payload
  }
);
