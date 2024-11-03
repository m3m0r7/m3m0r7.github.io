import { createContext, Dispatch, SetStateAction } from "react";
import { DialogType } from "./DialogContext";
import { MahjongOption } from "../../@types/types";

const OptionContext = createContext<[Partial<MahjongOption>, Dispatch<SetStateAction<Partial<MahjongOption>>>] | [null, null]>([null, null])

export default OptionContext
