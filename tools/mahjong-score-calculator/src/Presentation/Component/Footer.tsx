import React, { useState } from "react";
import { useCookies } from "react-cookie";

const Footer = () => {
  const [cookies, setCookie, removeCookie] = useCookies();
  const [clickedCookie, setClickedCookie] = useState(
    cookies.agreeCookie == "1",
  );

  const ok = () => {
    setClickedCookie(true);
    setCookie("agreeCookie", "1");
    console.log(cookies.agreeCookie);
  };

  return (
    <div className={clickedCookie ? "hidden" : ""}>
      <div className="footer">
        <div>
          当サイトでは、サイトの利便性向上を目的に Cookie
          を使用しています。当サイトをご利用いただくことで Cookie
          の利用を同意したものとみなします。
        </div>
        <div className="place-self-center">
          <div className="footer-ok-button" onClick={ok}>
            OK
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
