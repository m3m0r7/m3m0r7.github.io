import { Fu, MahjongOption, Yaku } from "../@types/types";
import { PaiPairCollection } from "../Collection/Collection";

export class Ankou implements Fu {
  private paiPairCollection: PaiPairCollection
  private option: MahjongOption

  constructor(paiPairCollection: PaiPairCollection, _yaku: Yaku[], option: MahjongOption) {
    this.paiPairCollection = paiPairCollection
    this.option = option
  }

  get value() {
    let count = 0

    count += this.paiPairCollection.countYaoChuHai({ isKoutsu: true, isFuro: false }) * 8
    count += this.paiPairCollection.countChunChanPai({ isKoutsu: true, isFuro: false }) * 4
    return count
  }

  get isFulfilled(): boolean {
    // The Anko is always true
    return this.value > 0
  }
}
