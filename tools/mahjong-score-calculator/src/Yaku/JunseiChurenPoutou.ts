import { MahjongOption, Yaku } from "../types";
import { PaiPairCollection } from "../Collection";

export class JunseiChurenPoutou implements Yaku {
  private paiPairCollection: PaiPairCollection
  private option: MahjongOption

  constructor(paiPairCollection: PaiPairCollection, option: MahjongOption) {
    this.paiPairCollection = paiPairCollection
    this.option = option
  }

  get type(): Yaku['type'] {
    return 'DOUBLE_FULL'
  }

  get isFulfilled(): boolean {
    if (!this.option.enableDoubleYakuman) {
      return false
    }

    // TODO: Not implemented yet
    return false
  }
}
