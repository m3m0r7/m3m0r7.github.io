import { createContext, Dispatch, SetStateAction } from "react";
import { DialogType } from "./DialogContext";
import { MahjongOption } from "../../@types/types";

export type SystemOption = {
  playStyle: 3 | 4;
  with500ScoreBar: boolean;
  ripai: boolean;
};

export const SystemDefaultOption: SystemOption = {
  playStyle: 4,
  with500ScoreBar: true,
  ripai: true,
};

const SystemOptionContext = createContext<
  [SystemOption, Dispatch<SetStateAction<SystemOption>>] | [null, null]
>([null, null]);

export default SystemOptionContext;
