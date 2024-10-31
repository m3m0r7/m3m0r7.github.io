import { MahjongOption, Yaku } from "../types";
import { PaiPairCollection } from "../Collection";
import { PaiGenerator } from "../PaiGenerator";
import { JunChanta } from "./JunChanta";

export class Chanta implements Yaku {
  private paiPairCollection: PaiPairCollection
  private option: MahjongOption

  constructor(paiPairCollection: PaiPairCollection, option: MahjongOption) {
    this.paiPairCollection = paiPairCollection
    this.option = option
  }

  get han(): number {
    return this.paiPairCollection.hasFuro
      ? 1
      : 2
  }

  get parent(): Yaku {
    return new JunChanta(this.paiPairCollection, this.option)
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
