import * as styles from "./Login.module.css";
import React from "react";
import { action, makeObservable, observable, runInAction } from "mobx";
import { observer } from "mobx-react";
import LogoSvg from "../../assets/TalentAdoreLogo.svg";
import { Button } from "../Button";
import type { AuthLoginDto, AuthLoginResponse } from "../../../server/auth/auth.types";
import { homeRoute, RouteComponentParams } from "../Navigation";
import { ApiError, authLoginApi, saveApiToken } from "../../apis";
import { appStore } from "../app-store";

export interface LoginProps extends RouteComponentParams {
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

  private authRequest(data: AuthLoginDto): Promise<AuthLoginResponse> {
    return authLoginApi().request({ data });
  }

  @action.bound
  async login() {
    const { username, password } = this;
    const { accessToken } = await this.authRequest({ username, password });

    // update logged username and save api-token
    appStore.user = { username };
    saveApiToken(accessToken);

    // redirect to home page after successful sign-in
    homeRoute.navigate({}, true);
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
        <a onClick={() => homeRoute.navigate()}>
          <img src={LogoSvg} height={40} alt="Logo" />
        </a>
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
