import { MahjongOption, Yaku } from "../@types/types";
import { PaiPairCollection } from "../Collection/Collection";

export class KazoeYakuman implements Yaku {
  private countYaku: number

  constructor(countYaku: number) {
    this.countYaku = countYaku
  }

  get type(): Yaku['type'] {
    return 'FULL'
  }

  get availableHora(): boolean {
    return false
  }

  get isFulfilled(): boolean {
    return this.countYaku >= 13
  }
}
