import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import type { User } from "./users.service";

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    // const request = ctx.switchToHttp().getRequest();
    // return request.user as User;

    return {username: "test"};
  }
);
