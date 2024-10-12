import React from "react";
import { computed, IComputedValue } from "mobx";
import { observer } from "mobx-react";
import { AppRoute, homeRoute, loginRoute, navigation, quizRandomRoute, quizRoute, quizRouteResult, RouteHelper, RouteParams } from "../Navigation";
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
    { route: quizRandomRoute, Component: Quiz, isDefault: true },
    { route: quizRouteResult, Component: QuizResult }
  ];

  static getDefaultRoute(): RouteHelper | undefined {
    return this.routes.find(({ isDefault }) => isDefault)?.route;
  }

  static getActiveRoute<Params extends RouteParams>(currentLocation = Router.getPath()): AppRoute<Params> | undefined {
    const routes = this.routes as AppRoute<Params>[];

    return routes.find(({ route: { getParams, toURLPath } }) => {
      const parsedParams = getParams(currentLocation);
      return toURLPath(parsedParams) === currentLocation;
    });
  }

  static getRouteParams<Params extends RouteParams>(route: RouteHelper<Params>): IComputedValue<Params> {
    return computed(() => route.getParams(Router.getPath()));
  }

  static redirect<Params extends RouteParams>(route: RouteHelper<Params>, params?: Params) {
    const path = route.toURLPath(params);
    navigation.replace(path);
    return true;
  }

  static homeRedirectCheck() {
    const currentLocation = this.getPath();
    const defaultRoute = this.getDefaultRoute();
    const currentRoute = this.getActiveRoute();
    const isHome = currentLocation === homeRoute.toURLPath();

    if (isHome && !currentRoute && defaultRoute) {
      this.redirect(defaultRoute, defaultRoute.getParams(currentLocation));
    }
  }

  componentDidMount() {
    Router.homeRedirectCheck();
  }

  componentDidUpdate() {
    Router.homeRedirectCheck();
  }

  render() {
    const currentLocation = Router.getPath();
    const { route, Component, noWrap } = Router.getActiveRoute(currentLocation) || {} as AppRoute;
    const params = Router.getRouteParams(route);
    const notFoundContent = !route && <NotFound />;
    const routeContent = route && <Component params={params} /> || notFoundContent;

    if (noWrap) {
      return routeContent;
    }

    return (
      <MainLayout>
        {routeContent}
      </MainLayout>
    );
  }
}
