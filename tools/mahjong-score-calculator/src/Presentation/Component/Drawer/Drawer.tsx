import React, { useContext } from "react";

import DrawerOverlay from "./DrawerOverlay";
import DrawerMenu from "./DrawerMenu";
import DrawerMenuContext from "../../Context/DrawerMenuContext";

const Drawer = () => {
  const [drawer, setDrawer] = useContext(DrawerMenuContext);

  return (
    <div className={`drawer ${drawer?.open ? "" : "hidden"}`}>
      <DrawerOverlay />
      <DrawerMenu />
    </div>
  );
};
export default Drawer;
