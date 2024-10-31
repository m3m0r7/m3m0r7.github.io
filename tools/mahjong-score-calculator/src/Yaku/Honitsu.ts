import { MahjongOption, Yaku } from "../types";
import { PaiPairCollection } from "../Collection";
import { PaiGenerator } from "../PaiGenerator";
import { Chinitsu } from "./Chinitsu";

export class Honitsu implements Yaku {
  private paiPairCollection: PaiPairCollection
  private option: MahjongOption

  constructor(paiPairCollection: PaiPairCollection, option: MahjongOption) {
    this.paiPairCollection = paiPairCollection
    this.option = option
  }

  get han(): number {
    return this.paiPairCollection.hasFuro
      ? 2
      : 3
  }

  get parent(): Yaku {
    return new Chinitsu(this.paiPairCollection, this.option)
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
