import * as styles from "./MainLayout.module.css";
import React from "react";
import { observer } from "mobx-react";
import LogoSvg from "../../assets/TalentAdoreLogo.svg";
import { cssNames, IClassName } from "../../utils";
import { LoggedUser } from "../Login";

export interface MainLayoutProps extends React.PropsWithChildren {
  className?: IClassName;
  headerClass?: IClassName;
  contentClass?: IClassName;
}

@observer
export class MainLayout extends React.Component<MainLayoutProps> {
  render() {
    const { className, contentClass, headerClass, children } = this.props;

    return (
      <div className={cssNames(styles.MainLayout, className)}>
        <div className={cssNames(styles.MainLayoutHeader, headerClass)}>
          <a href="/"><img src={LogoSvg} height={40} alt="Logo" /></a>
          <LoggedUser username="Quiz Taker" />
        </div>
        <div className={cssNames(styles.MainLayoutContent, contentClass)}>
          {children}
        </div>
      </div>
    );
  }
}
