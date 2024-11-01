import { Fu, MahjongOption, Yaku } from "../@types/types";
import { PaiPairCollection } from "../Collection/Collection";
import { Pinfu } from "../Yaku";

export class Futei implements Fu {
  private paiPairCollection: PaiPairCollection
  private option: MahjongOption
  private yakuList: Yaku[]

  constructor(paiPairCollection: PaiPairCollection, yakuList: Yaku[], option: MahjongOption) {
    this.paiPairCollection = paiPairCollection
    this.yakuList = yakuList
    this.option = option
  }

  get value() {
    return this.paiPairCollection.isChiiToitsu
      ? 25
      : 20
  }

  get isFulfilled(): boolean {
    // The Futei is always true
    return this.value > 0
  }
}
