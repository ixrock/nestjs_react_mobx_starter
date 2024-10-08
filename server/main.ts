import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { VERSION_NEUTRAL, VersioningType } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: VERSION_NEUTRAL,
  });

  await app.listen(3000);
}

bootstrap();
