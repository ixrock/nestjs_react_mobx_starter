export interface AuthLoginDto {
  username: string;
  password: string;
}

export interface AuthValidResponse {
  accessToken: string;
}
