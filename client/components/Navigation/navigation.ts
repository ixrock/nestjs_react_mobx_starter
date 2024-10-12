import { createObservableHistory } from "mobx-observable-history";

export const navigation = createObservableHistory();

export type RouteHelper<Params = object> = ReturnType<typeof buildRoute<Params>>;

export function isRouteHelper<Params>(helper: unknown): helper is RouteHelper<Params> {
  const validateKeys: (keyof RouteHelper<Params>)[] = ["routePath", "toURLPath", "getParams"];

  return Boolean(
    typeof helper === "object"
    && helper !== null /* exclude weird "null" object */
    && validateKeys.every(key => helper.hasOwnProperty(key)) /* validate fields somehow */
  );
}

export function buildRoute<Params>(routePath: string, defaultParams: Partial<Params> = {}) {
  return {
    routePath,

    toURLPath(params?: Params): string {
      if (!params) return routePath;

      return routePath.replace(/:(\w+)/g, (_, key: string) => (params as any)?.[key]);
    },

    getParams(pathname: string): Params {
      const parsedParams = { ...defaultParams } as Params;
      const pathParams = pathname.split("/");

      routePath.split("/").forEach((pathChunk, pathIndex) => {
        if (pathChunk.startsWith(":")) {
          const paramName = pathChunk.substring(1) as keyof Params; // parametrized route-param, e.g. from "/users/:userId"
          const paramValue = pathParams[pathIndex];
          parsedParams[paramName] = paramValue as Params[keyof Params];
        }
      });

      return parsedParams;
    },

    navigate(params?: Params, replace = false) {
      const routeParams = Object.assign({}, defaultParams, params);
      const path = this.toURLPath(routeParams);

      if (replace) {
        navigation.replace(path);
      } else {
        navigation.push(path);
      }
    }
  };
}
