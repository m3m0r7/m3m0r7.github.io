import { Fu, MahjongOption, Yaku } from "../types";
import { PaiPairCollection } from "../Collection";

export class Minkou implements Fu {
  private paiPairCollection: PaiPairCollection
  private option: Partial<MahjongOption>

  constructor(paiPairCollection: PaiPairCollection, _yaku: Yaku[], option: Partial<MahjongOption> = {}) {
    this.paiPairCollection = paiPairCollection
    this.option = option

  }

  get value() {
    let count = 0

    count += this.paiPairCollection.countYaoChuHai({ isFuro: true }) * 4
    count += this.paiPairCollection.countChunChanPai({ isFuro: true }) * 2
    return count
  }

  get isFulfilled(): boolean {
    return this.value > 0
  }
}
