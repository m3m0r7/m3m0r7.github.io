import { Fu, MahjongOption, Yaku } from "../@types/types";
import { PaiPairCollection } from "../Collection/Collection";

export class MenzenKafu implements Fu {
  private paiPairCollection: PaiPairCollection
  private option: MahjongOption

  constructor(paiPairCollection: PaiPairCollection, _yaku: Yaku[], option: MahjongOption) {
    this.paiPairCollection = paiPairCollection
    this.option = option
  }

  get value() {
    return this.option.hora.fromRon && !this.paiPairCollection.hasFuro
      ? 10
      : 0
  }

  get isFulfilled(): boolean {
    return !this.paiPairCollection.isChiiToitsu && this.value > 0
  }
}
