import { MahjongOption, PaiGroupName, PaiName, Yaku } from "../@types/types";
import { PaiPairCollection } from "../Collection/Collection";
import { PaiGenerator } from "../Utilities/PaiGenerator";
import { PaiPatternExtractor } from "../Runtime/Extractor/Extractor";

export class KokushiMusou13MenMachi implements Yaku {
  private paiPairCollection: PaiPairCollection
  private option: MahjongOption

  constructor(paiPairCollection: PaiPairCollection, option: MahjongOption) {
    this.paiPairCollection = paiPairCollection
    this.option = option
  }

  get type(): Yaku['type'] {
    return 'DOUBLE_FULL'
  }

  get isFulfilled(): boolean {
    if (!this.option.enableDoubleYakuman) {
      return false
    }

    return this.paiPairCollection.isKokushiMusou && this.option.additionalSpecialYaku.withKokushiMusou13MenMachi
  }
}
