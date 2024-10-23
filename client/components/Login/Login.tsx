import * as styles from "./Login.module.css";
import React from "react";
import { action, makeObservable, observable, runInAction } from "mobx";
import { observer } from "mobx-react";
import { Button } from "../Button";
import { Logo } from "../Logo";
import type { AuthLoginDto, AuthLoginResponse } from "#/auth/auth.types";
import { ApiError, authLoginApi, saveApiToken } from "@/apis";
import { homeRoute } from "@/components/Navigation";
import { appStore } from "../app.store";

export interface LoginProps {
}

@observer
export class Login extends React.Component<LoginProps> {
  static dataTestId = "login-form";
  static dataTestIdError = "login-error";

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
    homeRoute.redirect();
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
      <form className={styles.Login} onSubmit={this.onLogin} data-testid={Login.dataTestId}>
        <Logo className={styles.logo} />
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
        <div className={styles.authError} data-testid={Login.dataTestIdError}>
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
