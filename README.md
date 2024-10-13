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
5. After that you will be redirected `/quiz/random` and get `/quiz/1` _(serving mocked json from server)_.

## Client routes.ts (react.js, mobx)

- `/` app home page _(empty for now)_
- `/login` - user login form page
- `/quiz/random` - find random quiz and redirect to quiz page
- `/quiz/1` - quiz page _(shows quiz response from server-api)_
- `/quiz/1/result` - quiz result page _(empty for now)_

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

- I used `nest.js` as part of learning process instead of `postman` apis _(Postman's APIS/docs also takes some time to master, so it's postponed :)_
- I used custom router (see: `/client/components/Navigation/*`) built on top `mobx-observable-history` package since `mobx` is used for state-management the project. 
- Alternative good choice of routing could be `react-router@6` if current router implementation cannot be refactored/upgraded to whatever needs the app, but the official `ReactRouter` can do. _(what i'm doubt about)_


## TODO / what's missing:

- redirect to `/login` for failed or restricted apis (401,403)?
- submit quiz answers to backend endpoint 
- show quiz result page after submitting quiz answers
- improve quiz json mocks (add/generate more)
- add tests for backend services/endpoints via `@nestjs/testing`
- add tests for frontend via React Testing Library (example in this [guide](https://keploy.io/blog/community/a-guide-to-testing-react-components-with-jest-and-react-testing-library)) for components and `jest` for unit-tests in `utils/*`
- abstract usage of global app store observable (via some class `StorageHelper`)
- handle ComponentRoute dependent data-layer at routing level (e.g. preloading data for `/quiz/1` instead of manual handling, see: `Quiz.tsx`) / use global app store (via context?) to access data in components 
