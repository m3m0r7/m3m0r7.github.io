import { MahjongOption, Yaku } from "../types";
import { PaiPairCollection } from "../Collection";

export class Pinfu implements Yaku {
  private paiPairCollection: PaiPairCollection
  private option: MahjongOption

  constructor(paiPairCollection: PaiPairCollection, option: MahjongOption) {
    this.paiPairCollection = paiPairCollection
    this.option = option
  }

  get han(): number {
    return 1
  }

  get isFulfilled(): boolean {
    const horaPai = this.option.hora.pai
    if (!horaPai) {
      return false
    }

    // NOTE: The pinfu yaku is not allowed furo
    if (this.paiPairCollection.hasFuro) {
      return false
    }

    for (const paiPair of this.paiPairCollection.paiPairs) {
      // NOTE: The pinfu yaku waits only shuntsu, in other case, it is not fulfilled.
      if (!paiPair.isShuntsu) {
        continue
      }
      const [left, _, right] = paiPair.pattern

      // NOTE: The pinfu yaku is not allowed to wait a centered pai in shuntsu.
      if (left === horaPai || right === horaPai) {
        return true;
      }

    }
    return false
  }
}
