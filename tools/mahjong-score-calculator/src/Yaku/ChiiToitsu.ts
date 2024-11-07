import { MahjongOption, Yaku } from "../@types/types";
import { PaiPairCollection } from "../Collection/Collection";
import { PaiPatternExtractor } from "../Runtime/Extractor/Extractor";

export class ChiiToitsu implements Yaku {
  private paiPairCollection: PaiPairCollection;
  private option: MahjongOption;

  constructor(paiPairCollection: PaiPairCollection, option: MahjongOption) {
    this.paiPairCollection = paiPairCollection;
    this.option = option;
  }

  get type(): Yaku["type"] {
    return "NORMAL";
  }

  get han(): number {
    return 2;
  }

  get isFulfilled(): boolean {
    // NOTE: When chiiToitsu is not fulfilled if we have same colored 4 pai.
    for (let i = 0; i < this.paiPairCollection.paiPairs.length; i++) {
      for (let j = i + 1; j < this.paiPairCollection.paiPairs.length; j++) {
        if (
          this.paiPairCollection.paiPairs[i].pattern.includesWithMatrix(
            this.paiPairCollection.paiPairs[j].pattern,
          )
        ) {
          return false;
        }
      }
    }

    return this.paiPairCollection.isChiiToitsu;
  }
}
