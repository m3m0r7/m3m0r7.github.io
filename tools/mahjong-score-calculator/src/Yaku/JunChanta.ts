import { Yaku } from "../types";
import { PaiPairCollection } from "../Collection";
import { PaiGenerator } from "../PaiGenerator";

export class JunChanta implements Yaku {
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
    return null
  }

  get isFulfilled(): boolean {
    const result: boolean[] = []
    const allowedPatterns = PaiGenerator.generatePenchanHai();

    for (const paiPair of this.paiPairCollection.paiPairs) {
      result.push(
        allowedPatterns.includes(paiPair.pattern)
      )
    }
    return result.every(v => v)
  }
}
