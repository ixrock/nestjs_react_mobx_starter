import styles from "./SubTitle.module.css";
import React from "react";
import { observer } from "mobx-react";

export interface SubTitleProps {
}

@observer
export class SubTitle extends React.Component<SubTitleProps> {
  render() {
    return <div>SubTitle</div>;
  }
}
