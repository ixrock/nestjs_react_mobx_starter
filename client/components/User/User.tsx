import styles from "./User.module.css";
import React from "react";
import { observer } from "mobx-react";

export interface UserProps {
}

@observer
export class User extends React.Component<UserProps> {
  render() {
    return <div>Logged User icon + Username + ability to logout</div>;
  }
}
