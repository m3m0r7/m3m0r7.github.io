import { MahjongOption, Yaku } from "../@types/types";
import { PaiPairCollection } from "../Collection/Collection";
import { SuAnkou } from "./SuAnkou";

export class SuAnkouTankiMachi implements Yaku {
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
    if (!this.option.hora.fromTankiMachi) {
      return false
    }

    return (new SuAnkou(this.paiPairCollection, this.option)).isFulfilled
  }
}
