import { PaiPairCollection } from "../Collection";
import { Validator } from "../types";

export class MahjongFormatValidator implements Validator {
  private paiPairCollection: PaiPairCollection

  constructor(paiPairCollection: PaiPairCollection) {
    this.paiPairCollection = paiPairCollection
  }

  validate(): boolean {
    // NOTE: check normally format `(shuntsu | koutsu | kan){4} + jantou`
    return (this.paiPairCollection.countKan + this.paiPairCollection.countShuntsu + this.paiPairCollection.countKoutsu) === 4
      && (this.paiPairCollection.countJantou) === 1;
  }
}
