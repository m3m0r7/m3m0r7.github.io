import { Fu, MahjongOption, Yaku } from "../types";
import { PaiPairCollection } from "../Collection";

export class Futei implements Fu {
  private paiPairCollection: PaiPairCollection
  private option: Partial<MahjongOption>

  constructor(paiPairCollection: PaiPairCollection, _yaku: Yaku[], option: Partial<MahjongOption> = {}) {
    this.paiPairCollection = paiPairCollection
    this.option = option
  }

  get value() {
    return this.paiPairCollection.isChiitoitsu
      ? 25
      : 20
  }

  get isFulfilled(): boolean {
    // The Futei is always true
    return this.value > 0
  }
}
