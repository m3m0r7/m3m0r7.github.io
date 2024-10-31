import { MahjongOption, Yaku } from "../types";
import { PaiPairCollection } from "../Collection";

export class SuKantsu implements Yaku {
  private paiPairCollection: PaiPairCollection
  private option: MahjongOption

  constructor(paiPairCollection: PaiPairCollection, option: MahjongOption) {
    this.paiPairCollection = paiPairCollection
    this.option = option
  }

  get type(): Yaku['type'] {
    return 'FULL'
  }

  get isFulfilled(): boolean {
    for (let i = 0, counter = 0; i < this.paiPairCollection.paiPairs.length; i++) {
      const paiPair = this.paiPairCollection.paiPairs[i]
      if (paiPair.isKan) {
        counter++
      }

      if (counter === 4) {
        return true
      }
    }
    return false
  }
}
