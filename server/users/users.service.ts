import { Injectable } from "@nestjs/common";
import { createHash } from "crypto";

export interface User {
  username: string; // unique, hence could be used as user-ID
  password?: string; // encrypted password
}

@Injectable()
export class UsersService {
  // for the sake of simplicity we keep users list hardcoded here:
  // in real world scenario this should be provided from a database, e.g. with "@nestjs/typeorm"
  private readonly users: User[] = [
    {
      username: "admin",
      password: createHash("sha256").update("admin").digest("base64")
    }
  ];

  // pretending this is async operation for real-world scenario
  async verify(username: string, password: string): Promise<boolean> {
    const encodedPass = createHash("sha256").update(password).digest("base64");

    return this.users.some(user => user.username === username && user.password === encodedPass);
  }
}
