import * as styles from "./LoggedUser.module.css";
import React from "react";
import { observer } from "mobx-react";
import UserIcon from "../../assets/icons/user-01.svg";
import { cssNames } from "../../utils";

export interface UserProps {
}

@observer
export class LoggedUser extends React.Component<UserProps> {
  render() {
    return (
      <div className={cssNames(styles.LoggedUser)}>
        <img width={30} src={UserIcon} />
        <div>
          Username + ability to logout
        </div>
      </div>
    );
  }
}
