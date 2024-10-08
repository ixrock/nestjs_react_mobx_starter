import "./MainLayout.module.css";
import React from "react";
import { observer } from "mobx-react";

export interface MainLayoutProps {
}

@observer
export class MainLayout extends React.Component<MainLayoutProps> {
  render() {
    return <div>MainLayout</div>;
  }
}
