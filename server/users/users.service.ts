import { Injectable } from "@nestjs/common";
import { createHash } from "crypto";

@Injectable()
export class UsersService {
  // for the sake of simplicity we keep users list hardcoded here:
  // in real world scenario this should be provided from a database, e.g. with "@nestjs/typeorm"
  private readonly adminPass = createHash("sha256").update("admin").digest("base64");

  // pretending this is async operation for real-world scenario
  // all users that knows admin password allowed for demo simplicity
  async verify(username: string, password: string): Promise<boolean> {
    return this.adminPass === createHash("sha256").update(password).digest("base64");
  }
}
