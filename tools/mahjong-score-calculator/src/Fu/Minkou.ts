import { Fu, MahjongOption, Yaku } from "../@types/types";
import { PaiPairCollection } from "../Collection/Collection";

export class Minkou implements Fu {
  private paiPairCollection: PaiPairCollection;
  private option: MahjongOption;

  constructor(
    paiPairCollection: PaiPairCollection,
    _yaku: Yaku[],
    option: MahjongOption,
  ) {
    this.paiPairCollection = paiPairCollection;
    this.option = option;
  }

  get value() {
    let count = 0;

    count +=
      this.paiPairCollection.countYaoChuHai({ isKoutsu: true, isFuro: true }) *
      4;
    count +=
      this.paiPairCollection.countChunChanPai({
        isKoutsu: true,
        isFuro: true,
      }) * 2;
    return count;
  }

  get isFulfilled(): boolean {
    return this.value > 0;
  }
}
