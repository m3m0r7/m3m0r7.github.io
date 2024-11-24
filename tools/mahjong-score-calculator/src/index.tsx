import React from "react";
import "./Utilities/Utilities";
import App from "./Presentation/App";
import ReactDOM from "react-dom/client";

const VERSION = "β ver 0.29";

const dom = document.getElementById("root");
if (dom) {
  const root = ReactDOM.createRoot(dom);
  root.render(<App />);
}

document.querySelector("title")!.innerText = `麻雀点数計算機 ${VERSION}`;
