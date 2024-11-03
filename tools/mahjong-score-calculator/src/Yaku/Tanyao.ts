import { MahjongOption, Yaku } from "../@types/types";
import { PaiPairCollection } from "../Collection/Collection";
import { PaiGenerator } from "../Utilities/PaiGenerator";

export class Tanyao implements Yaku {
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

  get isFulfilled(): boolean {
    // NOTE: When kuitan is not allowed, the tanyao yaku is not available if you did furo
    if (this.paiPairCollection.hasFuro && !this.option.localRules.kuitan) {
      return false;
    }

    for (const paiPair of this.paiPairCollection.paiPairs) {
      const hasYaoChuHai = paiPair.pattern.some((paiName) =>
        PaiGenerator.generateYaoChuHai().includes(paiName),
      );
      if (hasYaoChuHai) {
        return false;
      }
    }
    return true;
  }
}
