import styles from "./Login.module.css";
import React from "react";
import { observer } from "mobx-react";

export interface LoginProps {
}

@observer
export class Login extends React.Component<LoginProps> {
  render() {
    return <div>Login form</div>;
  }
}
