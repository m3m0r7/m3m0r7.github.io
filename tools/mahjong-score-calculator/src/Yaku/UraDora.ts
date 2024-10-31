import { MahjongOption, Yaku } from "../types";
import { PaiPairCollection } from "../Collection";

export class UraDora implements Yaku {
  private paiPairCollection: PaiPairCollection
  private option: MahjongOption

  constructor(paiPairCollection: PaiPairCollection, option: MahjongOption) {
    this.paiPairCollection = paiPairCollection
    this.option = option
  }

  get availableHora(): boolean {
    // NOTE: A dora is not available hora, if you need to hora, and then you need to have other a yaku.
    return false
  }

  get han(): number {
    return this.paiPairCollection.paiPairs.reduce<number>(
      (carry, item) => carry + (
        this.option.uraDoraList.reduce((dora, pai) => dora + (this.option.uraDoraList.includes(pai) ? 1 : 0), 0)
      ),
      0
    )
  }

  get isFulfilled(): boolean {
    return this.han > 0
  }
}
