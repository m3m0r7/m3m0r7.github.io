import { MahjongOption, PaiGroupName, PaiName, Yaku } from "../@types/types";
import { PaiPairCollection } from "../Collection/Collection";
import { PaiGenerator } from "../Utilities/PaiGenerator";
import { PaiPatternExtractor } from "../Runtime/Extractor/Extractor";

export class KokushiMusou13MenMachi implements Yaku {
  private paiPairCollection: PaiPairCollection;
  private option: MahjongOption;

  constructor(paiPairCollection: PaiPairCollection, option: MahjongOption) {
    this.paiPairCollection = paiPairCollection;
    this.option = option;
  }

  get type(): Yaku["type"] {
    return this.option.enableDoubleYakuman ? "DOUBLE_FULL" : "FULL";
  }

  get isFulfilled(): boolean {
    return (
      this.paiPairCollection.isKokushiMusou &&
      this.paiPairCollection.paiPairs.every(
        (pattern) =>
          pattern.pattern.map((v) => v === this.option.hora.pai).sum() >= 2,
      )
    );
  }
}
