import { MahjongOption, Yaku } from "../@types/types";
import { PaiPairCollection } from "../Collection/Collection";

export class Haku implements Yaku {
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
    return 1
  }

  get isFulfilled(): boolean {
    return this.paiPairCollection.paiPairs.some(
      paiPair => (paiPair.isKoutsu || paiPair.isKan) && paiPair.pattern.includes('5z'),
    )
  }
}
