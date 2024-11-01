import { MahjongOption, Yaku } from "../@types/types";
import { PaiPairCollection } from "../Collection/Collection";

export class NagashiMangan implements Yaku {
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
    return 4
  }

  get calculationBasedHan(): number {
    return 5
  }

  get isFulfilled(): boolean {
    return this.option.additionalSpecialYaku.withNagashiMangan
  }
}
