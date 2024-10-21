import React from "react";
import { fireEvent, render } from "@testing-library/react";
import { LoggedUser } from "./LoggedUser";
import { loginRoute } from "../Navigation";

describe("Logged user component", () => {
  it("shows logged-out when `username` is NOT provided", () => {
    const { getByText, getByTestId, queryByRole } = render(
      <LoggedUser />
    );

    expect(getByText("Unknown")).toBeInTheDocument();
    fireEvent.click(getByTestId(LoggedUser.dataTestId));
    expect(queryByRole("login")).toBeInTheDocument();
    expect(queryByRole("logout")).not.toBeInTheDocument();
  });

  it("shows logged-in state when `username` is provided", () => {
    const { getByText, getByTestId, queryByRole } = render(
      <LoggedUser username="Joe" />
    );

    expect(getByText("Joe")).toBeInTheDocument();
    fireEvent.click(getByTestId(LoggedUser.dataTestId));
    expect(queryByRole("login")).not.toBeInTheDocument();
    expect(queryByRole("logout")).toBeInTheDocument();
  });

  it("redirects to login page route when clicked from menu", () => {
    const { getByTestId, queryByRole } = render(<LoggedUser />);

    expect(location.pathname).toBe("/");
    fireEvent.click(getByTestId(LoggedUser.dataTestId));
    fireEvent.click(queryByRole("login"));
    expect(location.pathname).toBe(loginRoute.toURLPath());
  });
});
