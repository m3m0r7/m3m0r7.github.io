import { MahjongOption, Yaku } from "../@types/types";
import { PaiPairCollection } from "../Collection/Collection";
import { PaiGenerator } from "../Utilities/PaiGenerator";
import { Chinitsu } from "./Chinitsu";

export class ChinRoutou implements Yaku {
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
    return this.paiPairCollection.paiPairs
      .every(paiPair => (paiPair.isKoutsu || paiPair.isKan) && paiPair.pattern.includesWithMatrix(PaiGenerator.generateRoutouHai()))
  }
}
