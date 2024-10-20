import * as styles from "./Logo.module.css";
import React from "react";
import { observer } from "mobx-react";
import { cssNames, IClassName } from "../../utils";
import { Icon } from "../Icon";
import LogoSvg from "../../assets/LogoExample.svg";
import { homeRoute } from "../Navigation";

export interface LogoProps {
  className?: IClassName;
}

@observer
export class Logo extends React.Component<LogoProps> {
  render() {
    return (
      <Icon
        svgContent={LogoSvg}
        className={cssNames(styles.Logo, this.props.className)}
        onClick={() => homeRoute.navigate()}
      />
    );
  }
}
