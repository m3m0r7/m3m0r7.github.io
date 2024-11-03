import React from "react";

const Footer = () => {
  return (
    <div className="footer">
      <p className="notice">
        (注) このツールは <a href="https://x.com/m3m0r7">@m3m0r7</a>{" "}
        によって個人開発されたものです。点数計算に誤りがあっても責任は負いかねます。不具合や追加要望などは
        <a href="https://github.com/m3m0r7">GitHub</a>{" "}
        よりご依頼またはプルリクエストください。
      </p>
    </div>
  );
};

export default Footer;
