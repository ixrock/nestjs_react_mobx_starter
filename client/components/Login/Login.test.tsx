import React from "react";
import { fireEvent, render, act } from "@testing-library/react";
import type { AuthLoginResponse } from "../../../server/auth/auth.types";
import { Login } from "./Login";
import { ApiError } from "../../apis";
import * as apis from "../../apis/endpoints.apis";
import * as apiToken from "../../apis/apiToken.storage";
import { appStore } from "../app.store";

describe("Login component", () => {
  let loginApiMock: jest.SpyInstance; // mocking real api calls before submit
  let saveApiTokenMock: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    loginApiMock = jest.spyOn(apis, "authLoginApi");
    saveApiTokenMock = jest.spyOn(apiToken, "saveApiToken");
  });

  it("renders form", () => {
    const { getByTestId } = render(<Login />);
    expect(getByTestId(Login.dataTestId)).toBeInTheDocument();
  });

  it("form submit successful", async () => {
    const { getByTestId, getByPlaceholderText } = render(<Login />);
    const userInput = getByPlaceholderText(/username/i);
    const passwordInput = getByPlaceholderText(/password/i);

    expect(userInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();

    fireEvent.input(userInput, { target: { value: "admin" } });
    fireEvent.input(passwordInput, { target: { value: "he11o_world" } });

    const requestMock = jest.fn(() => responseMock);
    const responseMock: AuthLoginResponse = {
      accessToken: "jwt-blablatoken"
    };

    loginApiMock.mockReturnValue({ request: requestMock });
    await act(async () => {
      fireEvent.submit(getByTestId(Login.dataTestId));
    });

    expect(requestMock).toHaveBeenCalledWith({
      data: {
        username: "admin",
        password: "he11o_world"
      }
    });

    expect(appStore.user?.username).toBe("admin");
    expect(saveApiTokenMock).toHaveBeenCalledWith(responseMock.accessToken);
  });

  it("form submit failed", async () => {
    const { getByRole, getByTestId } = render(<Login />);
    const errorInfo = getByTestId(Login.dataTestIdError);
    const submitBtn = getByRole("button", { name: /login/i });

    loginApiMock.mockReturnValue({
      request: jest.fn(() => {
        throw new ApiError(401, "Unauthorized");
      })
    });

    await act(async () => {
      fireEvent.click(submitBtn);
    });

    expect(errorInfo).toHaveTextContent("Login failed with 401 code: Unauthorized");
  });
});
