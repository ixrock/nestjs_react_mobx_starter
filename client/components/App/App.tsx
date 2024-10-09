import "./App.module.css";
import React from "react";
import { computed } from "mobx";
import { AppRoute, LoginPageParams, loginRoute, navigation, QuizPageParams, QuizResultsPageParams, quizRoute, quizRouteResult } from "../Navigation";
import { observer } from "mobx-react";
import { Login } from "../Login";
import { Quiz } from "../Quiz";
import { QuizResult } from "../Quiz/QuizResult";

@observer
export class App extends React.Component {
  static getPath(): string {
    return navigation.location.pathname;
  }

  static routes: AppRoute[] = [
    {
      route: loginRoute,
      params: computed<LoginPageParams>(() => loginRoute.getParams(App.getPath())),
      render() {
        return <Login />;
      }
    },
    {
      route: quizRouteResult,
      params: computed<QuizResultsPageParams>(() => quizRouteResult.getParams(App.getPath())),
      render({ quizId }: QuizResultsPageParams) {
        return <QuizResult quizId={quizId} />;
      }
    },
    {
      route: quizRoute,
      params: computed<QuizPageParams>(() => quizRoute.getParams(App.getPath())),
      render({ quizId }: QuizPageParams) {
        return <Quiz quizId={quizId} />;
      }
    }
  ];

  render() {
    const appPath = App.getPath();

    return (
      <div>
        <p><b>Location:</b> {appPath}</p>
        <ol><b>Routes:</b> {App.routes.map(({ route: { routePath } }) => <li key={routePath}>{routePath}</li>)}</ol>
      </div>
    );
  }
}
