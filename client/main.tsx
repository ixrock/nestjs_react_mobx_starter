import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./components/App/App";

export function bootstrap() {
  let rootElem = document.createElement("div");
  rootElem.id = "app";
  document.body.appendChild(rootElem);
  createRoot(rootElem).render(<App />);
}

bootstrap();
