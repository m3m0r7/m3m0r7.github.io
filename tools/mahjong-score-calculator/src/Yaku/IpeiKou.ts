import { MahjongOption, Yaku } from "../@types/types";
import { PaiPairCollection } from "../Collection/Collection";
import { RyanPeiKou } from "./RyanPeiKou";

export class IpeiKou implements Yaku {
  private paiPairCollection: PaiPairCollection;
  private option: MahjongOption;

  constructor(paiPairCollection: PaiPairCollection, option: MahjongOption) {
    this.paiPairCollection = paiPairCollection;
    this.option = option;
  }

  get type(): Yaku["type"] {
    return "NORMAL";
  }

  get han(): number {
    return 1;
  }

  get parent(): Yaku {
    return new RyanPeiKou(this.paiPairCollection, this.option);
  }

  get isFulfilled(): boolean {
    // NOTE: IpeiKou/RyanPeikou is not fulfilled including furo in PaiPairs
    if (this.paiPairCollection.hasFuro) {
      return false;
    }
    for (let i = 0; i < this.paiPairCollection.paiPairs.length; i++) {
      const targetPaiPair = this.paiPairCollection.paiPairs[i];
      if (!targetPaiPair.isShuntsu) {
        continue;
      }
      for (let j = i + 1; j < this.paiPairCollection.paiPairs.length; j++) {
        const sourcePaiPair = this.paiPairCollection.paiPairs[j];
        if (!sourcePaiPair.isShuntsu) {
          continue;
        }

        if (
          targetPaiPair.pattern.includesWithMatrix(sourcePaiPair.pattern, "AND")
        ) {
          return true;
        }
      }
    }
    return false;
  }
}
