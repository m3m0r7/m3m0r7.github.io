import { Yaku } from "../types";
import { PaiPairCollection } from "../Collection";
import { PaiGenerator } from "../PaiGenerator";
import { JunChanta } from "./JunChanta";

export class Chanta implements Yaku {
  private paiPairCollection: PaiPairCollection

  constructor(paiPairCollection: PaiPairCollection) {
    this.paiPairCollection = paiPairCollection
  }

  get han(): number {
    return this.paiPairCollection.hasFuro
      ? 1
      : 2
  }

  get parent(): Yaku | null {
    return new JunChanta(this.paiPairCollection)
  }

  get isFulfilled(): boolean {
    const result: boolean[] = []
    const allowedPatterns = PaiGenerator.generatePenchanHai();

    for (const paiPair of this.paiPairCollection.paiPairs) {
      result.push(
        allowedPatterns.includes(paiPair.pattern) || paiPair.pattern.some(pai => PaiGenerator.generateJiHai().includes(pai))
      )
    }
    return result.every(v => v)
  }
}
