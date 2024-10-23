import { Config } from "jest";

export default async function JestServerConfig(): Promise<Config> {
  return {
    rootDir: "./server",
    testEnvironment: "node",
    moduleNameMapper: {
      "^#/(.*?)$": "<rootDir>/$1"
    },
    moduleFileExtensions: [
      "js",
      "json",
      "ts"
    ],
    testRegex: ".*\\.spec\\.ts$",
    transform: {
      "^.+\\.(t|j)s$": "ts-jest"
    },
    collectCoverageFrom: [
      "**/*.(t|j)s"
    ]
  };
}
