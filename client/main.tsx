import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./components/App/App";
import { initAppStore } from "./components/app.store";

export async function bootstrap() {
  // create DOM-element placeholder for the app
  let rootElem = document.createElement("div");
  rootElem.id = "app";
  document.body.appendChild(rootElem);

  // preload data from backend apis
  await initAppStore();

  // render the app
  createRoot(rootElem).render(<App />);
}

void bootstrap();
