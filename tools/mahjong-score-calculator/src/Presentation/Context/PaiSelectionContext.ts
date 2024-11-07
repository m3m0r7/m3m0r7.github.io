import { createContext, Dispatch, SetStateAction } from "react";
import { PaiName } from "../../@types/types";

export type PaiSelectionType = {
  pai: PaiName;
  index: number;
  isAkaDora: boolean;
};

export type PaiInfo = {
  isFuro: boolean;
  isAkaDora: boolean;
  isHoraPai: boolean;
  isDoraPai: boolean;
  isUraDoraPai: boolean;
  isKanPai: boolean;
};

export type PaiOptionInfo = PaiInfo & PaiSelectionType;

export type PaiOption = {
  paiList: PaiOptionInfo[];
  peNukiList?: number[];
};

const PaiSelectionContext = createContext<
  [PaiOption, Dispatch<SetStateAction<PaiOption>>] | [null, null]
>([null, null]);

export default PaiSelectionContext;
