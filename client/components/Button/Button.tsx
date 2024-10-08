import * as styles from "./Button.module.css";
import React, { ButtonHTMLAttributes } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<any> {
  href?: string; // render as hyperlink
  target?: string; // in case of using @href
}

export class Button extends React.Component<ButtonProps> {
  private link: HTMLAnchorElement;
  private button: HTMLButtonElement;

  render() {
    return <button {...this.props} />;
  }
}
