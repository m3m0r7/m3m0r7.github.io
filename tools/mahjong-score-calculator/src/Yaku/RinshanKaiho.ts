import { MahjongOption, Yaku } from "../types";
import { PaiPairCollection } from "../Collection";

export class RinshanKaiho implements Yaku {
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
    return this.option.hora.fromRinshanPai || false
  }
}
