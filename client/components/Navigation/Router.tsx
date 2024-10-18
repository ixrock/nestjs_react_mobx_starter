import React from "react";
import { computed, IComputedValue } from "mobx";
import { observer } from "mobx-react";
import { AppRoute, homeRoute, loginRoute, navigation, quizRandomRoute, QuizResultRouteParams, quizRoute, QuizRouteParams, quizRouteResult, RouteHelper, RouteParams } from "../Navigation";
import { startAutoLoadRouteData, routeStore } from "./route.store";
import { quizApi, quizRandomApi, quizResultApi } from "../../apis";
import { ErrorBoundary } from "../ErrorBoundary";
import { MainLayout } from "../MainLayout";
import { NotFound } from "../NotFound";
import { Login } from "../Login";
import { Quiz, QuizRandom, QuizResult } from "../Quiz";

@observer
export class Router extends React.Component {
  static getPath(): string {
    return navigation.location.pathname;
  }

  static routes: AppRoute[] = [
    {
      route: loginRoute,
      Component: Login,
      noWrap: true
    },
    {
      // should be declared above of quizRout with `/quiz/:quiz` since it has more specific path "/quiz/random"
      route: quizRandomRoute,
      Component: QuizRandom,
      isDefault: true,
      preload: () => quizRandomApi().request()
    },
    {
      route: quizRoute,
      Component: Quiz,
      preload: ({ quizId }: QuizRouteParams) => quizApi(quizId).request()
    },
    {
      route: quizRouteResult,
      Component: QuizResult,
      preload: ({ quizId }: QuizResultRouteParams) => quizResultApi(quizId).request()
    }
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

  constructor(props: {}) {
    super(props);
    Router.homeRedirectCheck();
    startAutoLoadRouteData();
  }

  componentDidUpdate() {
    Router.homeRedirectCheck();
  }

  render() {
    const currentLocation = Router.getPath();
    const { route, Component, noWrap } = Router.getActiveRoute(currentLocation) || {} as AppRoute;
    const params = Router.getRouteParams(route);
    const preloadResult = routeStore[route?.routePath] ?? {};

    const routeContent = (
      <ErrorBoundary noWrap={noWrap}>
        {route && <Component params={params} {...preloadResult} />}
        {!route && <NotFound />}
      </ErrorBoundary>
    );

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
