import React from "react";
import { observer } from "mobx-react";
import { AppRoute, loginRoute, navigation, quizRoute, quizRouteResult, RouteParams } from "../Navigation";
import { Login } from "../Login";
import { Quiz } from "../Quiz";
import { QuizResult } from "../Quiz/QuizResult";
import { NotFound } from "../NotFound";
import { MainLayout } from "../MainLayout";

@observer
export class Router extends React.Component {
  static getPath(): string {
    return navigation.location.pathname;
  }

  static routes: AppRoute[] = [
    { route: loginRoute, Component: Login, topLayout: true },
    { route: quizRoute, Component: Quiz },
    { route: quizRouteResult, Component: QuizResult }
  ];

  static getActiveRoute<Params extends RouteParams>(currentLocation = Router.getPath()): AppRoute<Params> | undefined {
    const routes = this.routes as AppRoute<Params>[];

    return routes.find(({ route: { getParams, toURLPath } }) => {
      const parsedParams = getParams(currentLocation);
      return toURLPath(parsedParams) === currentLocation;
    });
  }

  render() {
    const currentLocation = Router.getPath();
    const isRootPath = currentLocation === "/";
    const { route, Component, topLayout } = Router.getActiveRoute(currentLocation) || {};
    const routeParams = route?.getParams(currentLocation);

    if (topLayout && route) {
      return <Component {...routeParams} />;
    }

    return (
      <MainLayout>
        {!route && !isRootPath && <NotFound />}
        {route && <Component {...routeParams} />}
      </MainLayout>
    );
  }
}
