import { MahjongOption, Yaku } from "../types";
import { PaiPairCollection } from "../Collection";

export class Haku implements Yaku {
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
    return this.paiPairCollection.paiPairs.some(
      paiPair => paiPair.isKoutsu && paiPair.pattern.includes('5z'),
    )
  }
}
