import { Koutsu, MahjongOption, Yaku } from "../@types/types";
import { PaiPairCollection } from "../Collection/Collection";

export class DaiSushi implements Yaku {
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
    return ([
      ["1z", "1z", "1z"],
      ["2z", "2z", "2z"],
      ["3z", "3z", "3z"],
      ["4z", "4z", "4z"],
    ] as Koutsu[]).every(paiNames => this.paiPairCollection.paiPairs.some(paiPair => (paiPair.isKoutsu || paiPair.isKan) && paiPair.pattern.includesWithMatrix(paiNames)))
  }
}
