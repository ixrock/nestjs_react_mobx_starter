import "./App.module.css";
import React from "react";
import { MainLayout } from "../MainLayout";
import { Quiz } from "../Quiz";

export class App extends React.Component {
  render() {
    return (
      <MainLayout>
        <Quiz />
      </MainLayout>
    );
  }
}
