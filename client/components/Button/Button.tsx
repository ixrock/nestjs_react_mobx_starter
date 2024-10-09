import * as styles from "./Button.module.css";
import React, { ButtonHTMLAttributes } from "react";
import { cssNames } from "../../utils";

export type ButtonElement = HTMLButtonElement /*| HTMLAnchorElement*/;

export interface ButtonProps extends ButtonHTMLAttributes<ButtonElement>, React.PropsWithChildren {
  label?: React.ReactNode;
  primary?: boolean; // use main theme color
}

export class Button extends React.Component<ButtonProps> {
  private buttonElem?: HTMLButtonElement;

  render() {
    const { children, primary, className, label = children, ...btnProps } = this.props;
    const btnClass = cssNames(styles.Button, className, {
      [styles.primary]: primary,
    });

    return (
      <button type="button" {...btnProps} className={btnClass} ref={e => this.buttonElem = e}>
        {label}
      </button>
    );
  }
}
