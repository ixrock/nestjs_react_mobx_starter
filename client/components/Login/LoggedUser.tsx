import * as styles from "./LoggedUser.module.css";
import React from "react";
import { observer } from "mobx-react";
import UserIcon from "../../assets/icons/user-01.svg";
import { cssNames, IClassName } from "../../utils";
import { action, makeObservable, observable } from "mobx";
import { Icon } from "../Icon";

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

  logout(evt: React.MouseEvent) {
    evt.preventDefault();
    evt.stopPropagation();

    console.log("//FIXME: make actual logout here");
  }

  render() {
    const { username, className } = this.props;

    const arrowIconClass = cssNames(
      styles.arrowIcon,
      this.isMenuOpen ? styles.arrowUpIcon : styles.arrowDownIcon
    );

    return (
      <div className={cssNames(styles.LoggedUser, className)} onClick={this.toggleMenu}>
        <Icon svgContent={UserIcon} className={styles.userIcon} />
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
