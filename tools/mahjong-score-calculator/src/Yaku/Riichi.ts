import { MahjongOption, Yaku } from "../types";
import { PaiPairCollection } from "../Collection";
import { PaiGenerator } from "../PaiGenerator";
import { JunChanta } from "./JunChanta";
import { DoubleRiichi } from "./DoubleRiichi";

export class Riichi implements Yaku {
  private paiPairCollection: PaiPairCollection
  private option: MahjongOption

  constructor(paiPairCollection: PaiPairCollection, option: MahjongOption) {
    this.paiPairCollection = paiPairCollection
    this.option = option
  }

  get han(): number {
    return 1
  }

  get parent(): Yaku {
    return new DoubleRiichi(this.paiPairCollection, this.option)
  }

  get isFulfilled(): boolean {
    return this.option.additionalSpecialYaku.withRiichi || false
  }
}
