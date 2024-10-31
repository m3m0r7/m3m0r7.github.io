import { MahjongOption, Yaku } from "../types";
import { PaiPairCollection } from "../Collection";
import { PaiGenerator } from "../PaiGenerator";
import { JunChanta } from "./JunChanta";

export class DoubleRiichi implements Yaku {
  private paiPairCollection: PaiPairCollection
  private option: MahjongOption

  constructor(paiPairCollection: PaiPairCollection, option: MahjongOption) {
    this.paiPairCollection = paiPairCollection
    this.option = option
  }

  get han(): number {
    return 2
  }

  get isFulfilled(): boolean {
    return this.option.additionalSpecialYaku.withDoubleRiichi || false
  }
}
