import * as styles from "./Login.module.css";
import React from "react";
import { action, makeObservable, observable } from "mobx";
import { observer } from "mobx-react";
import { Button } from "../Button";
import LogoSvg from "../../assets/TalentAdoreLogo.svg";
import { RouteParams } from "../Navigation";

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

  onLogin = (evt: React.FormEvent) => {
    const { username, password } = this;
    evt.preventDefault();

    console.log("TODO: use API to login", { username, password });
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
        <Button
          primary
          label="Login"
          type="submit"
        />
      </form>
    );
  }
}
