import * as path from "path";
import { Controller, Get, Res } from "@nestjs/common";
import { AppService } from "./app.service";
import type { Response } from "express";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {
  }

  @Get()
  index(@Res() res: Response) {
    res.sendFile(path.join(__dirname, "../../dist/client/index.html"));
  }

  @Get("hello")
  getHello(): string {
    return this.appService.getHello();
  }
}
