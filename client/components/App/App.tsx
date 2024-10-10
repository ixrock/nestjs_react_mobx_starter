import "./App.module.css";
import React from "react";
import { Router } from "../Navigation";
import { observer } from "mobx-react";

@observer
export class App extends React.Component {
  render() {
    return <Router />;
  }
}
