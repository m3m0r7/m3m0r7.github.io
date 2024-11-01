import { MahjongOption, Yaku } from "../@types/types";
import { PaiPairCollection } from "../Collection/Collection";
import { PaiGenerator } from "../Utilities/PaiGenerator";

export class Tanyao implements Yaku {
  private paiPairCollection: PaiPairCollection

  constructor(paiPairCollection: PaiPairCollection, _: MahjongOption) {
    this.paiPairCollection = paiPairCollection
  }

  get type(): Yaku['type'] {
    return 'NORMAL'
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
