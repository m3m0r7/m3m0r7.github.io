import { MahjongOption, Yaku } from "../types";
import { PaiPairCollection } from "../Collection";
import { PaiGenerator } from "../PaiGenerator";

export class Tanyao implements Yaku {
  private paiPairCollection: PaiPairCollection

  constructor(paiPairCollection: PaiPairCollection, _: MahjongOption) {
    this.paiPairCollection = paiPairCollection
  }

  get han(): number {
    return 1
  }

  get isFulfilled(): boolean {
    for (const paiPair of this.paiPairCollection.paiPairs) {
      const hasYaoChuHai = paiPair.pattern.some(paiName => PaiGenerator.generateYaoChuHai().includes(paiName));
      if (hasYaoChuHai) {
        return false
      }
    }
    return true
  }
}
