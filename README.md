# Modern and fast web-app starter kit

_Main tech-stack: TypeScript, Nest.js, React.js, MobX._

## Prerequisites

- Node >= `12.x`
- NPM >= `6.x`

## Demo app running steps:

1. `npm run server:start:dev` - compiles `dist/server/*` and run nest.js local server in dev-mode (watch).
2. `npm run client:start:dev` - compiles `dist/client/*` files in dev-mode (watch).
3. Open in browser http://localhost:3000/login
4. Login with any username and password == `admin` to get access token for restricted apis. 
5. JWT-token (issued via `@nestjs/jwt`) stored in browser's session storage after successful login.
5. After that you will be redirected `/quiz/random` to get a quiz.

## Client (routes.ts)

- `/` app home page _(redirects to random-quiz page)_
- `/login` - user login form page
- `/quiz/random` - find random-quiz and redirect to quiz page
- `/quiz/:quizId` - quiz page
- `/quiz/:quizId/result` - quiz results page

## Backend (endpoints.apis.ts)

```
POST /api/v1/auth/login
GET /api/v1/auth/user
GET /api/v1/user/quiz/random
GET /api/v1/user/quiz/:quizId
GET /ap i/v1/user/quiz/:quizId/result
POST /api/v1/user/quiz/:quizId/submit
```

## Some notes about frontend architecture:

- I personally dislike the direction where React.JS went with hooks and functions (maybe it make sense in case of SSR, e.g. Next.js) and I don't think using classes is outdated or slow thing. In most of the cases it proves better readability and maintainability when properly utilized. When paired with MobX for state management it's becoming a charm and fully scalable.
- I used custom router as PoC for [mobx-observable-history](https://www.npmjs.com/package/mobx-observable-history) package (see: `/client/components/Navigation/*`) since I use already `mobx` for state management in the project. Otherwise, if not enough, standard `react-router-dom` would be recommended.
