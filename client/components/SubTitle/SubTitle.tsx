import * as styles from "./SubTitle.module.css";
import React from "react";
import { observer } from "mobx-react";
import { cssNames, IClassName } from "@/utils";

export interface SubTitleProps extends React.PropsWithChildren {
  label?: React.ReactNode;
  className?: IClassName;
}

@observer
export class SubTitle extends React.Component<SubTitleProps> {
  render() {
    const { className, children, label = children } = this.props;

    return (
      <h3 className={cssNames(styles.SubTitle, className)}>
        {label}
      </h3>
    );
  }
}
