import * as styles from "./MainLayout.module.css";
import React from "react";
import { observer } from "mobx-react";
import { cssNames, IClassName } from "../../utils";
import { LoggedUser } from "../Login";
import { appStore } from "../app.store";
import { Logo } from "../Logo";

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
          <Logo className={styles.logo} />
          <LoggedUser username={appStore.user?.username} />
        </div>
        <div className={cssNames(styles.MainLayoutContent, contentClass)}>
          {children}
        </div>
      </div>
    );
  }
}
