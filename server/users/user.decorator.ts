import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import type { AuthSignPayload } from "../auth/auth.types";

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    return (request.user as AuthSignPayload)?.username; // get auth user's JWT payload
  }
);
