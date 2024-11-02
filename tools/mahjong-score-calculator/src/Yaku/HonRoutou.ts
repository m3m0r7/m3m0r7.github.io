import { MahjongOption, Yaku } from "../@types/types";
import { PaiPairCollection } from "../Collection/Collection";
import { PaiGenerator } from "../Utilities/PaiGenerator";
import { Chinitsu } from "./Chinitsu";

export class HonRoutou implements Yaku {
  private paiPairCollection: PaiPairCollection
  private option: MahjongOption

  constructor(paiPairCollection: PaiPairCollection, option: MahjongOption) {
    this.paiPairCollection = paiPairCollection
    this.option = option
  }

  get type(): Yaku['type'] {
    return 'NORMAL'
  }

  get han(): number {
    return 2
  }

  get isFulfilled(): boolean {
    return this.paiPairCollection.paiPairs
      .filter(v => !v.isJantou)
      .every(paiPair => (paiPair.isKoutsu || paiPair.isKan || paiPair.isToitsu) && paiPair.pattern.includesWithMatrix(PaiGenerator.generateYaoChuHai()))
  }
}
