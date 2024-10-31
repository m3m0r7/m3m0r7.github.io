import { Koutsu, MahjongOption, Yaku } from "../types";
import { PaiPairCollection } from "../Collection";

export class DaiSanGen implements Yaku {
  private paiPairCollection: PaiPairCollection
  private option: MahjongOption

  constructor(paiPairCollection: PaiPairCollection, option: MahjongOption) {
    this.paiPairCollection = paiPairCollection
    this.option = option
  }

  get type(): Yaku['type'] {
    return 'FULL'
  }

  get isFulfilled(): boolean {
    return ([
      ["5z", "5z", "5z"],
      ["6z", "6z", "6z"],
      ["7z", "7z", "7z"],
    ] as Koutsu[]).every(paiNames => this.paiPairCollection.paiPairs.some(paiPair => (paiPair.isKoutsu || paiPair.isKan) && paiPair.pattern.includesWithMatrix(paiNames)))
  }
}
