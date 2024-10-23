import "./App.module.css";
import React from "react";
import { observer } from "mobx-react";
import { Router } from "@/components/Navigation";

@observer
export class App extends React.Component {
  render() {
    return <Router />;
  }
}
