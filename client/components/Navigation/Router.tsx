import React from "react";
import { computed } from "mobx";
import { observer } from "mobx-react";
import { AppRoute, loginRoute, navigation, quizRoute, quizRouteResult, RouteHelper, RouteParams } from "../Navigation";
import { Login } from "../Login";
import { Quiz, QuizResult } from "../Quiz";
import { NotFound } from "../NotFound";
import { MainLayout } from "../MainLayout";

@observer
export class Router extends React.Component {
  static getPath(): string {
    return navigation.location.pathname;
  }

  static routes: AppRoute[] = [
    { route: loginRoute, Component: Login, noWrap: true },
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

  static getRouteParams<Params extends RouteParams>(route: RouteHelper<Params>) {
    return computed(() => route.getParams(Router.getPath()));
  }

  render() {
    const currentLocation = Router.getPath();
    const isRootPath = currentLocation === "/";
    const { route, Component, noWrap } = Router.getActiveRoute(currentLocation) || {} as AppRoute;
    const params = Router.getRouteParams(route);

    if (route && noWrap) {
      return <Component params={params} />;
    }

    return (
      <MainLayout>
        {!route && !isRootPath && <NotFound />}
        {route && <Component params={params} />}
      </MainLayout>
    );
  }
}
