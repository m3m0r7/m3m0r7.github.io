import { PaiInfo, PaiName } from "../@types/types";
import { PaiPatternExtractor } from "../Runtime/Extractor/Extractor";
import { PaiOptionInfo } from "../Presentation/Context/PaiSelectionContext";

export const convertPaiOptionInfoToPaiName = (
  paiOptionInfo: PaiOptionInfo,
): PaiName => {
  const [number, group] = PaiPatternExtractor.extractPaiPair(paiOptionInfo.pai);

  return `${number}${group}${paiOptionInfo.isAkaDora ? "a" : ""}${paiOptionInfo.isFuro ? "f" : ""}${paiOptionInfo.isDoraPai ? "d" : ""}${paiOptionInfo.isUraDoraPai ? "u" : ""}${paiOptionInfo.isKanPai ? "k" : ""}` as PaiName;
};

export const convertToNormalPai = (
  paiName: PaiName | undefined,
  includeAkaDora = true,
): PaiName | undefined => {
  if (!paiName) {
    return undefined;
  }
  const [number, group, option] = PaiPatternExtractor.extractPaiPair(paiName);

  return `${number}${group}${includeAkaDora && option.isAkaDora ? "a" : ""}` as PaiName;
};
