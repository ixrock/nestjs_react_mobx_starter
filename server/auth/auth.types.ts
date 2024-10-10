/* data transfer object collected from user's login form */
export interface AuthLoginDto {
  username: string;
  password: string;
}

/* valid response on sign in */
export interface AuthLoginResponse {
  accessToken: string;
}

/* what's gonna be stored under the user's JWT-token */
export interface AuthSignPayload {
  username: string;
}
