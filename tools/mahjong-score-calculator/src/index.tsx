import React from "react";
import "./Utilities/Utilities";
import App from "./Presentation/App";
import ReactDOM from "react-dom/client";

const dom = document.getElementById("root");
if (dom) {
  const root = ReactDOM.createRoot(dom);
  root.render(<App />);
}
