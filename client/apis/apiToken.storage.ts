// Demo: user login session per opened browser tab

export const API_TOKEN_KEY = "api-token";

export function saveApiToken(authToken: string) {
  return sessionStorage.setItem(API_TOKEN_KEY, authToken);
}

export function getApiToken() {
  return sessionStorage.getItem(API_TOKEN_KEY);
}
