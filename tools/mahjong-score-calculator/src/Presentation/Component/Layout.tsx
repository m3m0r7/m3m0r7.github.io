import React from "react";
import "./layout.css";

const Layout = (props: { children: React.ReactNode }) => {
  return (
    <>
      <div className="layout">
        <div className="layout-contents">{props.children}</div>
      </div>
    </>
  );
};

export default Layout;
