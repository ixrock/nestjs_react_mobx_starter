import { Config } from "jest";

export default async function JestClientConfig(): Promise<Config> {
  const mocksRootDir = `<rootDir>/../tests/__mocks__`;

  return {
    rootDir: "./client",
    preset: "ts-jest",
    testEnvironment: "jsdom",
    verbose: true,
    moduleNameMapper: {
      "\\.module\\.css$": `${mocksRootDir}/object.js`,
      "\\.svg$": `${mocksRootDir}/string.js`
    },
    setupFilesAfterEnv: [
      `<rootDir>/jest-setup.ts`
    ]
  };
}
