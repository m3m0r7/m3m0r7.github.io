import { Fu, MahjongOption, Yaku } from "../types";
import { PaiPairCollection } from "../Collection";
import { Pinfu } from "../Yaku/Pinfu";

export class Tsumo implements Fu {
  private paiPairCollection: PaiPairCollection
  private option: Partial<MahjongOption>
  private yakuList: Yaku[]

  constructor(paiPairCollection: PaiPairCollection, yakuList: Yaku[], option: Partial<MahjongOption> = {}) {
    this.paiPairCollection = paiPairCollection
    this.option = option
    this.yakuList = yakuList
  }

  get value() {
    return this.option.hora?.fromTsumo && !this.paiPairCollection.isChiitoitsu && this.yakuList.some(yaku => !(yaku instanceof Pinfu))
      ? 2
      : 0
  }

  get isFulfilled(): boolean {
    return this.value > 0
  }
}
