import React, { useContext } from "react";
import DrawerMenuContext from "../../Context/DrawerMenuContext";

const DrawerOverlay = () => {
  const [drawer, setDrawer] = useContext(DrawerMenuContext);

  const closeDrawer = () => {
    setDrawer?.({
      open: false,
    });
  };

  return <div className="drawer-overlay" onClick={closeDrawer}></div>;
};
export default DrawerOverlay;
