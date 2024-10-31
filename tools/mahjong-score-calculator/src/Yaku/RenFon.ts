import { MahjongOption, Yaku } from "../types";
import { PaiPairCollection } from "../Collection";

export class RenFon implements Yaku {
  private paiPairCollection: PaiPairCollection
  private option: MahjongOption

  constructor(paiPairCollection: PaiPairCollection, option: MahjongOption) {
    this.paiPairCollection = paiPairCollection
    this.option = option
  }

  get han(): number {
    // NOTE: Here is same of Dabu-Nan|Ton.
    return 2
  }

  get isFulfilled(): boolean {
    return this.option.kaze === this.option.jikaze && this.paiPairCollection.paiPairs.some(paiPair => (paiPair.isKoutsu || paiPair.isKan)
      && paiPair.pattern.includes(this.option.kaze))
  }
}
