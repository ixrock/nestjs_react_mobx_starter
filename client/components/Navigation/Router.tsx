import React from "react";
import { observer } from "mobx-react";
import { AppRoute, homeRoute, loginRoute, navigation, quizRandomRoute, QuizResultRouteParams, quizRoute, QuizRouteParams, quizRouteResult, RouteHelper, RouteParams } from "../Navigation";
import { quizApi, quizRandomApi, quizResultApi } from "@/apis";
import { routeStore, startAutoLoadRouteData } from "@/components/Navigation";
import { MainLayout, Login, NotFound, ErrorBoundary, Quiz, QuizRandom, QuizResult } from "@/components";

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

  static getRouteParams<Params extends RouteParams>(route: RouteHelper<Params>): Params {
    return route.getParams(Router.getPath());
  }

  static redirect<Params extends RouteParams>(route: RouteHelper<Params>, params?: Params) {
    const path = route.toURLPath(params);
    navigation.replace(path);
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
    const params = route ? Router.getRouteParams(route) : undefined;
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
