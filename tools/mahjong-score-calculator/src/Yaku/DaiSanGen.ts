import { MahjongOption, Yaku } from "../types";
import { PaiPairCollection } from "../Collection";

export class DaiSanGen implements Yaku {
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
    // TODO: Not implemented yet
    return false
  }
}
