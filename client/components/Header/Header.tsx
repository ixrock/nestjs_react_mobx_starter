import styles from "./Header.module.css";
import React from "react";
import { observer } from "mobx-react";

export interface LoginProps {
}

@observer
export class Header extends React.Component<LoginProps> {
  render() {
    return <div>(left) Logo + LoggedUser (right)</div>;
  }
}
