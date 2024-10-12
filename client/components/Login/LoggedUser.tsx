import * as styles from "./LoggedUser.module.css";
import React from "react";
import { observer } from "mobx-react";
import UserIconSvg from "../../assets/icons/user-01.svg";
import { cssNames, IClassName } from "../../utils";
import { action, makeObservable, observable } from "mobx";
import { Icon } from "../Icon";
import { saveApiToken } from "../../apis";
import { loginRoute } from "../Navigation";
import { logoutAppStore } from "../app-store";

export interface UserProps {
  className?: IClassName;
  username: string;
}

@observer
export class LoggedUser extends React.Component<UserProps> {
  @observable isMenuOpen = false;

  constructor(props: UserProps) {
    super(props);
    makeObservable(this);
  }

  @action.bound
  toggleMenu(evt: React.MouseEvent) {
    this.isMenuOpen = !this.isMenuOpen;
  }

  @action.bound
  private logout(evt: React.MouseEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    logoutAppStore();
    saveApiToken(""); // clear token
    loginRoute.navigate(); // redirect to login page
  }

  render() {
    const { username, className } = this.props;

    const arrowIconClass = cssNames(
      styles.arrowIcon,
      this.isMenuOpen ? styles.arrowUpIcon : styles.arrowDownIcon
    );

    return (
      <div className={cssNames(styles.LoggedUser, className)} onClick={this.toggleMenu}>
        <Icon svgContent={UserIconSvg} className={styles.userIcon} />
        <div className={styles.userName}>{username}</div>
        <i className={arrowIconClass} />

        {this.isMenuOpen && (
          // in real-world scenario we would use separated component based on: <Menu>, <Dropdown> or <ReactSelect>
          <div className={styles.menu} onClick={this.logout}>
            <a href="/logout">Logout</a>
          </div>
        )}
      </div>
    );
  }
}
