import * as styles from "./ProgressLine.module.css";
import React from "react";
import { observer } from "mobx-react";
import { cssNames, IClassName } from "../../utils";

export type ProgressBarValue = `${string}%` | number /* int */;

export interface ProgressLineProps {
  className?: IClassName;
  min?: ProgressBarValue; // default: 1
  max?: ProgressBarValue; // default: 100
  value: ProgressBarValue;
}

@observer
export class ProgressLine extends React.Component<ProgressLineProps> {
  static defaultProps = {
    min: 1,
    max: 100
  } as ProgressLineProps;

  render() {
    const { className, min, max, value } = this.props;

    let percentsValue = typeof value === "string" ? value : "";
    if (typeof value === "number") {
      percentsValue = (value / (max as number) * 100) + "%";
    }

    return (
      <div className={cssNames(styles.ProgressLine, className)}>
        <div className={styles.ProgressLineValue} style={{ width: percentsValue }} />
      </div>
    );
  }
}
