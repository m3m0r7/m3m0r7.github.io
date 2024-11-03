import { MahjongOption, PaiGroupName, PaiName, Yaku } from "../@types/types";
import { PaiPairCollection } from "../Collection/Collection";
import { PaiPatternExtractor } from "../Runtime/Extractor/Extractor";
import { PaiGenerator } from "../Utilities/PaiGenerator";

export class JunseiChurenPoutou implements Yaku {
  private paiPairCollection: PaiPairCollection;
  private option: MahjongOption;

  constructor(paiPairCollection: PaiPairCollection, option: MahjongOption) {
    this.paiPairCollection = paiPairCollection;
    this.option = option;
  }

  get type(): Yaku["type"] {
    return "DOUBLE_FULL";
  }

  get isFulfilled(): boolean {
    if (!this.option.enableDoubleYakuman) {
      return false;
    }

    // NOTE: The churen poutou is available to menzen only
    if (this.paiPairCollection.hasFuro) {
      return false;
    }

    return (
      this.paiPairCollection.isChurenPoutou &&
      this.option.additionalSpecialYaku.withJunseiChurenPoutou
    );
  }
}
