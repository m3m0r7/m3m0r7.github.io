import { MahjongOption, Yaku } from "../types";
import { PaiPairCollection } from "../Collection";
import { PaiGenerator } from "../PaiGenerator";
import { Chinitsu } from "./Chinitsu";

export class HonRoutou implements Yaku {
  private paiPairCollection: PaiPairCollection
  private option: MahjongOption

  constructor(paiPairCollection: PaiPairCollection, option: MahjongOption) {
    this.paiPairCollection = paiPairCollection
    this.option = option
  }

  get han(): number {
    return 2
  }

  get isFulfilled(): boolean {
    return this.paiPairCollection.paiPairs
      .every(paiPair => (paiPair.isKoutsu || paiPair.isKan) && paiPair.pattern.includesWithMatrix(PaiGenerator.generateYaoChuHai()))
  }
}
