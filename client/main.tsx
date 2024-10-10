import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./components/App/App";
import { initAppStore } from "./components/app-store";

export async function bootstrap() {
  let rootElem = document.createElement("div");
  rootElem.id = "app";
  document.body.appendChild(rootElem);

  // preload initial data from backend apis
  await initAppStore();

  createRoot(rootElem).render(<App />);
}

void bootstrap();
