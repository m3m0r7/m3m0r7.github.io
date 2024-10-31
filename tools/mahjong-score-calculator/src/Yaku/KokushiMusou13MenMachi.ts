import { MahjongOption, Yaku } from "../types";
import { PaiPairCollection } from "../Collection";

export class KokushiMusou13MenMachi implements Yaku {
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
    return this.option.enableDoubleYakuman
      && this.paiPairCollection.isKokushiMusou
      && this.option.additionalSpecialYaku.withKokushiMusou13MenMachi
  }
}
