import * as styles from "./ErrorBoundary.module.css";

import React, { ErrorInfo, PropsWithChildren } from "react";
import { observer } from "mobx-react";
import { action, makeObservable, observable } from "mobx";
import { cssNames, IClassName } from "../../utils";
import { navigation } from "../Navigation";
import { SubTitle } from "../SubTitle";
import { Button } from "../Button";

export interface ErrorBoundaryProps extends PropsWithChildren {
  className?: IClassName;
  noWrap?: boolean;
}

@observer
export class ErrorBoundary extends React.Component<ErrorBoundaryProps> {
  @observable.ref errorInfo?: ErrorInfo;
  @observable errorStack: string;

  constructor(props: object) {
    super(props);
    makeObservable(this);
  }

  @action
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.errorInfo = errorInfo;
    this.errorStack = error.stack;
  }

  render() {
    const { errorStack, errorInfo } = this;
    const { className, noWrap, children: content } = this.props;

    const boundaryClassName = cssNames(styles.ErrorBoundary, className, {
      [styles.noWrap]: noWrap
    });

    if (errorInfo) {
      return (
        <div className={boundaryClassName}>
          <SubTitle>Oops... Something went wrong.</SubTitle>
          <p>
            If this issue happens all the time please report it to {(
            <a href="https://github.com/ixrock/nestjs_react_mobx_starter/issues" target="_blank">
              Github issue tracker
            </a>
          )}
          </p>
          <pre>{errorStack}</pre>

          <SubTitle>Components stack info</SubTitle>
          <pre>{errorInfo.componentStack}</pre>

          <Button primary onClick={() => navigation.goBack()}>Back</Button>
        </div>
      );
    }

    return content;
  }
}
