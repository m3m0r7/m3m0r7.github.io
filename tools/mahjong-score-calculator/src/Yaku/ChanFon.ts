import { MahjongOption, Yaku } from "../types";
import { PaiPairCollection } from "../Collection";

export class ChanFon implements Yaku {
  private paiPairCollection: PaiPairCollection
  private option: MahjongOption

  constructor(paiPairCollection: PaiPairCollection, option: MahjongOption) {
    this.paiPairCollection = paiPairCollection
    this.option = option
  }

  get han(): number {
    return 1
  }

  get isFulfilled(): boolean {
    return this.option.kaze !== this.option.jikaze && this.paiPairCollection.paiPairs.some(paiPair => (paiPair.isKoutsu || paiPair.isKan)
      && paiPair.pattern.includes(this.option.kaze))
  }
}
