import { PaiPairCollection } from "../Collection/Collection";
import { Validator } from "../@types/types";

export class MahjongFormatValidator implements Validator {
  private paiPairCollection: PaiPairCollection;

  constructor(paiPairCollection: PaiPairCollection) {
    this.paiPairCollection = paiPairCollection;
  }

  validate(): boolean {
    // NOTE: check normally format `(shuntsu | koutsu | kan){4} + jantou`
    return (
      (this.paiPairCollection.countKan +
        this.paiPairCollection.countShuntsu +
        this.paiPairCollection.countKoutsu ===
        4 &&
        this.paiPairCollection.countJantou === 1) ||
      this.paiPairCollection.isKokushiMusou ||
      this.paiPairCollection.isChiiToitsu ||
      this.paiPairCollection.isChurenPoutou
    );
  }
}
