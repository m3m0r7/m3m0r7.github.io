import { MahjongOption, Yaku } from "../types";
import { PaiPairCollection } from "../Collection";

export class SanAnkou implements Yaku {
  private paiPairCollection: PaiPairCollection
  private option: MahjongOption

  constructor(paiPairCollection: PaiPairCollection, option: MahjongOption) {
    this.paiPairCollection = paiPairCollection
    this.option = option
  }

  get type(): Yaku['type'] {
    return 'NORMAL'
  }

  get han(): number {
    return 2
  }

  get isFulfilled(): boolean {
    for (let i = 0, counter = 0; i < this.paiPairCollection.paiPairs.length; i++) {
      const paiPair = this.paiPairCollection.paiPairs[i]
      if (!paiPair.isFuro && (paiPair.isKoutsu || paiPair.isKan)) {
        counter++
      }

      if (counter === 3) {
        return true
      }
    }
    return false
  }
}
