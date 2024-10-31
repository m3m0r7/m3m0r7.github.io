import { MahjongOption, Yaku } from "../types";
import { PaiPairCollection } from "../Collection";
import { PaiGenerator } from "../PaiGenerator";
import { Chinitsu } from "./Chinitsu";

export class IkkiTsuukan implements Yaku {
  private paiPairCollection: PaiPairCollection
  private option: MahjongOption
  private includeFuro: boolean = false

  constructor(paiPairCollection: PaiPairCollection, option: MahjongOption) {
    this.paiPairCollection = paiPairCollection
    this.option = option
  }

  get type(): Yaku['type'] {
    return 'NORMAL'
  }

  get han(): number {
    return this.includeFuro
      ? 1
      : 2
  }

  get isFulfilled(): boolean {
    const groupedPatterns = [
      (new PaiGenerator('1', '9', 'm')).generate().chunk(3),
      (new PaiGenerator('1', '9', 'p')).generate().chunk(3),
      (new PaiGenerator('1', '9', 's')).generate().chunk(3),
    ];

    for (const patterns of groupedPatterns) {
      const result = this.paiPairCollection.paiPairs
        .every(paiPair => {
          const result = patterns.every(pattern => paiPair.pattern.includesWithMatrix(pattern, 'AND'))
          if (paiPair.isFuro && result) {
            this.includeFuro = true
          }
          return result
        })
      if (result) {
        return true
      }
    }

    return false
  }
}
