import { Fu, MahjongOption, Yaku } from "../types";
import { PaiPairCollection } from "../Collection";

export class MenzenKafu implements Fu {
  private paiPairCollection: PaiPairCollection
  private option: Partial<MahjongOption>

  constructor(paiPairCollection: PaiPairCollection, _yaku: Yaku[], option: Partial<MahjongOption> = {}) {
    this.paiPairCollection = paiPairCollection
    this.option = option
  }

  get value() {
    return this.option.hora?.fromRon && !this.paiPairCollection.hasFuro
      ? 10
      : 0
  }

  get isFulfilled(): boolean {
    return this.value > 0
  }
}
