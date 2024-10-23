import { Config } from "jest";

export default async function JestClientConfig(): Promise<Config> {
  const mocksRootDir = `<rootDir>/../tests/__mocks__`;

  return {
    rootDir: "./client",
    preset: "ts-jest",
    testEnvironment: "jsdom",
    verbose: true,
    moduleNameMapper: {
      "\\.module\\.css$": `${mocksRootDir}/object.js`, // record of class names (webpack)
      "\\.svg$": `${mocksRootDir}/string.js`, // base64 string (webpack)
      "^@/(.*?)$": "<rootDir>/$1", // short imports for `client/*` via "@/path"
      "^#/(.*?)$": "<rootDir>/../server/$1",  // short imports for `server/*` via "#/path"
    },
    setupFilesAfterEnv: [
      "<rootDir>/jest-setup.ts"
    ]
  };
}
