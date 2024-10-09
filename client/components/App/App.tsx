import "./App.module.css";
import React from "react";
import { observer } from "mobx-react";
import { makeObservable, observable } from "mobx";
import { MainLayout } from "../MainLayout";
import { Quiz } from "../Quiz";
import { Login } from "../Login";

@observer
export class App extends React.Component {
  constructor(props: React.PropsWithChildren) {
    super(props);
    makeObservable(this);
  }

  @observable isLogged = false; // TODO: use global state from store

  render() {
    if (!this.isLogged) {
      return <Login />;
    }

    return (
      <MainLayout>
        <Quiz />
      </MainLayout>
    );
  }
}
