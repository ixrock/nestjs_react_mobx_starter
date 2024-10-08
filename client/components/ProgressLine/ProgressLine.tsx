import styles from "./ProgressLine.module.css";
import React from "react";
import { observer } from "mobx-react";

export interface ProgressLineProps {
}

@observer
export class ProgressLine extends React.Component<ProgressLineProps> {
  render() {
    return <div>ProgressLine</div>;
  }
}
