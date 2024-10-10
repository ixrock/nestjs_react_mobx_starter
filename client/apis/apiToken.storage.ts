// Demo: user login session per opened browser tab

export function saveApiToken(authToken: string) {
  return sessionStorage.setItem("token", authToken);
}

export function getApiToken() {
  return sessionStorage.getItem("token");
}
