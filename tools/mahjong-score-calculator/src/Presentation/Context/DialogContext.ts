import { createContext, Dispatch, SetStateAction } from "react";
import { PaiName } from "../../@types/types";
import { PaiOptionType, PaiSelectionType } from "./PaiSelectionContext";

export type DialogType =
  | {
      open: false;
      openType?: null;
    }
  | {
      open: true;
      openType: "score-detail";
    }
  | {
      open: true;
      openType: "input-support";
    }
  | {
      open: true;
      openType: "reset-calculation";
    }
  | {
      open: true;
      openType: "score-list-view";
    }
  | {
      open: true;
      openType: "attention";
    }
  | {
      open: true;
      openType: "pe-nuki";
      index: number;
    }
  | {
      open: true;
      openType: "confirm-kan";
      value: PaiName;
    }
  | {
      open: true;
      openType: "select-pai";
      value: PaiSelectionType;
    }
  | {
      open: true;
      openType: "score-calculation";
      value: PaiOptionType;
    };

export const DialogInitial: DialogType = {
  open: false,
};

const DialogContext = createContext<
  [DialogType, Dispatch<SetStateAction<DialogType>>] | [null, null]
>([null, null]);

export default DialogContext;
