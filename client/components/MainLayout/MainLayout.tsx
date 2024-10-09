import * as styles from "./MainLayout.module.css";
import React from "react";
import { observer } from "mobx-react";
import Logo from "../../assets/TalentAdoreLogo.svg?inline";

import { cssNames, IClassName } from "../../utils";
import { LoggedUser } from "../Login";

export interface MainLayoutProps {
  className?: IClassName;
  headerClass?: IClassName;
  contentClass?: IClassName;
}

@observer
export class MainLayout extends React.Component<MainLayoutProps> {
  render() {
    const { className, contentClass, headerClass, ...props } = this.props;

    return (
      <div className={cssNames(styles.MainLayout, className)}>
        <div className={cssNames(styles.MainLayoutHeader, headerClass)}>
          <img src={Logo} height={40} alt="Logo" />
          <LoggedUser />
        </div>
        <div className={cssNames(styles.MainLayoutContent, contentClass)}>
          Content
        </div>
      </div>
    );
  }
}
