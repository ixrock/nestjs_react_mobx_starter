import React from "react";
import { fireEvent, render } from "@testing-library/react";
import { LoggedUser } from "./LoggedUser";

describe("Logged user component", () => {
  it("shows logged-out when `username` is NOT provided", () => {
    const { getByText, getByTestId, queryByRole } = render(
      <LoggedUser />
    );

    expect(getByText("Unknown")).toBeInTheDocument();

    fireEvent.click(getByTestId("user"));
    expect(queryByRole("login")).toBeInTheDocument();
    expect(queryByRole("logout")).not.toBeInTheDocument();
  });

  it("shows logged-in state when `username` is provided", () => {
    const { getByText, getByTestId, queryByRole } = render(
      <LoggedUser username="Joe" />
    );

    expect(getByText("Joe")).toBeInTheDocument();

    fireEvent.click(getByTestId("user"));
    expect(queryByRole("login")).not.toBeInTheDocument();
    expect(queryByRole("logout")).toBeInTheDocument();
  });
});
