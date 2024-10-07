import { Injectable } from "@nestjs/common";
import { createHash } from "crypto";

export interface User {
  username: string; // must be unique, hence could be used as user-ID
  passwordHash?: string; // encrypted password
}

@Injectable()
export class UsersService {
  // for the sake of simplicity we keep users list hardcoded here:
  // in real world scenario this should be provided from a database, e.g. with "@nestjs/typeorm"
  private readonly users: User[] = [
    {
      username: "admin",
      passwordHash: createHash("sha256").update("admin").digest("base64")
    }
  ];

  verify(username: string, password: string): boolean {
    const encodedPass = createHash("sha256").update(password).digest("base64");

    return this.users.some(user => user.username === username && user.passwordHash === encodedPass);
  }

  findOne(username: string): User | undefined {
    return this.users.find(user => user.username === username);
  }
}
