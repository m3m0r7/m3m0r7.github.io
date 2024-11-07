import { PaiPairCollection } from "../Collection/Collection";
import { Validator } from "../@types/types";
import { PaiPatternExtractor } from "../Runtime/Extractor/Extractor";

export class MahjongFormatValidator implements Validator {
  private paiPairCollection: PaiPairCollection;

  constructor(paiPairCollection: PaiPairCollection) {
    this.paiPairCollection = paiPairCollection;
  }

  validate(): boolean {
    const paiCount = this.paiPairCollection.paiPairs
      .map((paiPair) => paiPair.pattern.length)
      .sum();

    const kanAbleList = this.paiPairCollection.paiPairs.filter((v) => {
      return v.isKan;
    });

    const needsRinshanPai = kanAbleList.length;

    // NOTE: Invalid pai list (As it is called, sho-hai (少牌) and/or ta-hai (多牌))
    if (paiCount !== 14 + needsRinshanPai) {
      return false;
    }

    // NOTE: check normally format `(shuntsu | koutsu | kan){4} + jantou`
    return (
      (this.paiPairCollection.countKan +
        this.paiPairCollection.countShuntsu +
        this.paiPairCollection.countKoutsu ===
        4 &&
        this.paiPairCollection.countJantou === 1) ||
      ((this.paiPairCollection.isKokushiMusou ||
        this.paiPairCollection.isChiiToitsu ||
        this.paiPairCollection.isChurenPoutou) &&
        paiCount === 14)
    );
  }
}
