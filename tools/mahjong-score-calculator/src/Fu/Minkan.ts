import { Fu, MahjongOption, Yaku } from "../@types/types";
import { PaiPairCollection } from "../Collection/Collection";

export class Minkan implements Fu {
  private paiPairCollection: PaiPairCollection
  private option: MahjongOption

  constructor(paiPairCollection: PaiPairCollection, _yaku: Yaku[], option: MahjongOption) {
    this.paiPairCollection = paiPairCollection
    this.option = option
  }

  get value() {
    let count = 0

    count += this.paiPairCollection.countYaoChuHai({ isKan: true, isFuro: true }) * 16
    count += this.paiPairCollection.countChunChanPai({ isKan: true, isFuro: true }) * 8
    return count
  }

  get isFulfilled(): boolean {
    return this.value > 0
  }
}
