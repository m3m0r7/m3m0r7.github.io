import { MahjongOption, Yaku } from "../@types/types";
import { PaiPairCollection } from "../Collection/Collection";
import { SuAnkou } from "./SuAnkou";
import { PaiPatternExtractor } from "../Runtime/Extractor/Extractor";

export class SuAnkouTankiMachi implements Yaku {
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

    return (
      this.paiPairCollection.paiPairs.some(
        (v) => v.isJantou && v.pattern.includes(this.option.hora.pai),
      ) && new SuAnkou(this.paiPairCollection, this.option).isFulfilled
    );
  }
}
