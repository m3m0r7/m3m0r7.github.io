import { Yaku } from "../types";
import { PaiPairCollection } from "../Collection";
import { PaiGenerator } from "../PaiGenerator";
import { Chinitsu } from "./Chinitsu";

export class Honitsu implements Yaku {
  private paiPairCollection: PaiPairCollection

  constructor(paiPairCollection: PaiPairCollection) {
    this.paiPairCollection = paiPairCollection
  }

  get han(): number {
    return this.paiPairCollection.hasFuro
      ? 2
      : 3
  }

  get parent(): Yaku | null {
    return new Chinitsu(this.paiPairCollection)
  }

  get isFulfilled(): boolean {
    const { m, p, s } = PaiGenerator.generateOneToNine()
    const jiHai = PaiGenerator.generateJiHai()

    for (const pai of [m, p, s]) {
      const result: boolean[] = []
      for (const paiPair of this.paiPairCollection.paiPairs) {
        const hasSameColored = paiPair.pattern.every(paiName => [...pai, ...jiHai].includes(paiName));

        result.push(hasSameColored)
      }

      if (result.every(v => v)) {
        return true
      }
    }

    return false
  }
}
