import { MahjongOption, Yaku } from "../types";
import { PaiPairCollection } from "../Collection";
import { JunChanta } from "./JunChanta";

export class RyanPeiKou implements Yaku {
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
    // NOTE: IpeiKou/RyanPeikou is not fulfilled including furo in PaiPairs
    if (this.paiPairCollection.hasFuro) {
      return false
    }
    for (let i = 0; i < this.paiPairCollection.paiPairs.length; i++) {
      const targetPaiPair = this.paiPairCollection.paiPairs[i];
      if (!targetPaiPair.isShuntsu) {
        continue
      }
      for (let j = i + 1, counter = 0; j < this.paiPairCollection.paiPairs.length; j++) {
        const sourcePaiPair = this.paiPairCollection.paiPairs[j];
        if (!sourcePaiPair.isShuntsu) {
          continue
        }

        if (targetPaiPair.pattern.includesWithMatrix(sourcePaiPair.pattern, 'AND')) {
          counter++
        }

        if (counter === 2) {
          return true
        }
      }
    }
    return false
  }
}
