import { createContext, Dispatch, SetStateAction } from "react";

export type DrawerMenuType = {
  open: boolean;
};

export const DrawerMenuInitial = {
  open: false,
};

const DrawerMenuContext = createContext<
  [DrawerMenuType, Dispatch<SetStateAction<DrawerMenuType>>] | [null, null]
>([null, null]);

export default DrawerMenuContext;
