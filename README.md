# TalentAdore - Developer Assignment

_Tech-stack: TypeScript, Nest.js, React.js, MobX, etc._

## Prerequisites

- Node >= 12.x
- NPM >= 6.x

## Installation

```bash
npm install
```

## Demo running steps:

1. `npm run server:start:dev` - compiles `dist/server/*` and run nest.js local server in dev-mode (watch).
2. `npm run client:start:dev` - compiles `dist/client/*` files in dev-mode (watch).
3. Open in browser http://localhost:3000/login
4. Login with any username and password == `admin` to get access token for restricted apis. 
5. JWT-token (issued via `@nestjs/jwt`) stored in browser's session storage after successful login.
5. After that you will be redirected `/quiz/random` to get a quiz.

## Client routes.ts (react.js, mobx)

- `/` app home page _(empty for now)_
- `/login` - user login form page
- `/quiz/random` - find random quiz and redirect to quiz page
- `/quiz/:quizId` - quiz page _(shows quiz from server-api)_
- `/quiz/:quizId/result` - quiz result page _(empty for now)_

## Backend endpoints.apis.ts (nest.js)

```
POST /api/v1/auth/login
GET /api/v1/auth/user
GET /api/v1/user/quiz/random
GET /api/v1/user/quiz/:quizId
GET /api/v1/user/quiz/:quizId/result
POST /api/v1/user/quiz/:quizId/submit
```

## Some notes on taken decisions:

- I used `nest.js` as part of learning process instead of `Postman` _(time/effort more profitable, Postman can wait:)_
- I used custom router as PoC for `mobx-observable-history` package (see: `/client/components/Navigation/*`) since I use already `mobx` for state management in the project.

## TODO / what's missing:

- add tests for backend services/endpoints via `@nestjs/testing`
- add tests for frontend via React Testing Library (example in this [guide](https://keploy.io/blog/community/a-guide-to-testing-react-components-with-jest-and-react-testing-library)) for components and `jest` for unit-tests in `utils/*`
- add end-to-end tests, e.g. via [Playwright](https://playwright.dev/) or other library.
