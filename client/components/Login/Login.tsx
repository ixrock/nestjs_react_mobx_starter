import * as styles from "./Login.module.css";
import React from "react";
import { action, makeObservable, observable, runInAction } from "mobx";
import { observer } from "mobx-react";
import { Button } from "../Button";
import LogoSvg from "../../assets/TalentAdoreLogo.svg";
import { navigation, quizRoute, RouteParams } from "../Navigation";
import { ApiError, authLoginApi, saveApiToken } from "../../apis";
import type { AuthLoginDto, AuthLoginResponse } from "../../../server/auth/auth.types";

export interface LoginProps extends RouteParams {
}

@observer
export class Login extends React.Component<LoginProps> {
  constructor(props: LoginProps) {
    super(props);
    makeObservable(this);
  }

  @observable username = "";
  @observable password = "";
  @observable authError = "";

  authRequest(data: AuthLoginDto): Promise<AuthLoginResponse> {
    return authLoginApi<AuthLoginResponse>().request({
      data: JSON.stringify(data)
    });
  }

  async login() {
    const { username, password } = this;
    const { accessToken } = await this.authRequest({ username, password });
    const homePathOnLogin = quizRoute.toURLPath({ quizId: "random" });

    saveApiToken(accessToken); // save for restricted apis access
    navigation.push(homePathOnLogin);
  }

  onLogin = async (evt: React.FormEvent) => {
    evt.preventDefault();

    try {
      await this.login();
    } catch (err: ApiError | unknown) {
      runInAction(() => {
        if (err instanceof ApiError) {
          const { statusCode, message } = err;
          this.authError = `Login failed with ${statusCode} code: ${message}`;
        } else {
          this.authError = String(err);
        }
      });
    }
  };

  render() {
    return (
      <form className={styles.Login} onSubmit={this.onLogin}>
        <a href="/"><img src={LogoSvg} height={40} alt="Logo" /></a>
        <input
          autoFocus
          name="username"
          placeholder="Username"
          value={this.username}
          onChange={action((evt) => this.username = evt.target.value)}
        />
        <input
          type="password" name="password"
          placeholder="Password"
          value={this.password}
          onChange={action((evt) => this.password = evt.target.value)}
        />
        <div className={styles.authError}>
          {this.authError}
        </div>
        <Button
          primary
          label="Login"
          type="submit"
        />
      </form>
    );
  }
}
