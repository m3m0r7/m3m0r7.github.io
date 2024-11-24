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

export type PaiOptionType = {
  paiList: PaiOptionInfo[];
  peNukiList?: number[];
};

export const PaiOptionInitial = {
  paiList: [],
};

const PaiSelectionContext = createContext<
  [PaiOptionType, Dispatch<SetStateAction<PaiOptionType>>] | [null, null]
>([null, null]);

export default PaiSelectionContext;
