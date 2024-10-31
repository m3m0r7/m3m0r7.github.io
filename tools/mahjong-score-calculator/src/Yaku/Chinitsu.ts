import { MahjongOption, Yaku } from "../types";
import { PaiPairCollection } from "../Collection";
import { PaiGenerator } from "../PaiGenerator";

export class Chinitsu implements Yaku {
  private paiPairCollection: PaiPairCollection

  constructor(paiPairCollection: PaiPairCollection, _: MahjongOption) {
    this.paiPairCollection = paiPairCollection
  }

  get type(): Yaku['type'] {
    return 'NORMAL'
  }

  get han(): number {
    return this.paiPairCollection.hasFuro
      ? 5
      : 6
  }

  get isFulfilled(): boolean {
    const { m, p, s } = PaiGenerator.generateOneToNine()

    for (const pai of [m, p, s]) {
      const result: boolean[] = []
      for (const paiPair of this.paiPairCollection.paiPairs) {
        const hasSameColored = paiPair.pattern.every(paiName => pai.includes(paiName));

        result.push(hasSameColored)
      }

      if (result.every(v => v)) {
        return true
      }
    }

    return false
  }
}
