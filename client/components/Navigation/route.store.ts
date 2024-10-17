import { autorun, flow, observable } from "mobx";
import type { ApiError } from "../../apis";
import { Router } from "./Router";
import { AppRoute } from "./routes";

export interface RouteStore {
  [routePath: string]: RouteStorePreload;
}

export interface RouteStorePreload<Data = any, Error = ApiError | unknown> {
  data?: Data;
  error?: Error;
  isLoading?: boolean;
}

export const routeStore = observable.object<RouteStore>({});

export const preloadRouteData = flow(function* (activeRoute: AppRoute) {
  const { route, preload } = activeRoute ?? {};

  if (route && preload) {
    const { routePath } = route;
    const routeParams = Router.getRouteParams(route);

    // reset previous result (if any)
    delete routeStore[routePath];
    routeStore[routePath] ??= {};
    routeStore[routePath].isLoading = true;

    try {
      routeStore[routePath].data = yield preload(routeParams.get());
    } catch (err: ApiError | unknown) {
      routeStore[routePath].error = err;
    } finally {
      routeStore[routePath].isLoading = false;
    }
  }
});

export function startAutoLoadRouteData() {
  return autorun(async () => {
    const activeRoute = Router.getActiveRoute();
    if (activeRoute) {
      preloadRouteData(activeRoute);
    }
  });
}
