import * as path from "path";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ServeStaticModule } from "@nestjs/serve-static";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { QuizModule } from "./quiz/quiz.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      envFilePath: [".development.env"]
    }),

    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, "../client")
    }),

    AuthModule,
    QuizModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {
}
