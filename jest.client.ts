import { Config } from "jest";

export default async function JestClientConfig(): Promise<Config> {
  return {
    rootDir: "./client",
    preset: "ts-jest",
    testEnvironment: "jsdom",
    verbose: true,
  };
}
