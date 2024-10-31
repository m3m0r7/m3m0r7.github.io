import { MahjongOption, Yaku } from "../types";
import { PaiPairCollection } from "../Collection";
import { PaiGenerator } from "../PaiGenerator";
import { JunChanta } from "./JunChanta";

export class OpenRiichi implements Yaku {
  private paiPairCollection: PaiPairCollection
  private option: MahjongOption

  constructor(paiPairCollection: PaiPairCollection, option: MahjongOption) {
    this.paiPairCollection = paiPairCollection
    this.option = option
  }

  get han(): number {
    return 1
  }

  get isFulfilled(): boolean {
    return this.option.additionalSpecialYaku.withOpenRiichi || false
  }
}
