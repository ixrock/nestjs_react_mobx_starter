import { observable } from "mobx";
import { getUserApi } from "../apis";
import type { LoggedUserPayload } from "../../server/auth/auth.types";

export interface AppStore {
  user?: LoggedUserPayload;
}

export const appStore = observable.object<AppStore>({});

export async function initAppStore() {
  try {
    appStore.user = await getUserApi().request().catch(() => null);
  } catch (err) {
    console.log("UNEXPECTED ERR", err);
  }
}

export function logoutAppStore() {
  delete appStore.user;
}
