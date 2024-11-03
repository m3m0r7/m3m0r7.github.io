import { createContext, Dispatch, SetStateAction } from "react";
import { PaiName } from "../../@types/types";
import { PaiOption, PaiSelectionType } from "./PaiSelectionContext";

export type DialogType = {
  open: false
  openType?: null,
} | {
  open: true
  openType: 'score-detail'
} | {
  open: true
  openType: 'reset-calculation'
} | {
  open: true
  openType: 'select-pai',
  value: PaiSelectionType,
} | {
  open: true,
  openType: 'score-calculation',
  value: PaiOption,
};

const DialogContext = createContext<[DialogType, Dispatch<SetStateAction<DialogType>>] | [null, null]>([null, null])

export default DialogContext
