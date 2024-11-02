import { MahjongOption, Yaku } from "../@types/types";
import { PaiPairCollection } from "../Collection/Collection";
import { PaiGenerator } from "../Utilities/PaiGenerator";
import { Chinitsu } from "./Chinitsu";
import { PaiPatternExtractor } from "../Runtime/Extractor/Extractor";

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
    ]

    for (const pattern of groupedPatterns) {
      const furoJudgers = [false, false, false]

      const checkShuntsu = (index: number) => this.paiPairCollection.paiPairs.some(paiPair => {
        const result = paiPair.pattern.same(pattern[index])
        if (result) {
          furoJudgers[index] = paiPair.isFuro
        }
        return result
      })

      if (checkShuntsu(0) && checkShuntsu(1) && checkShuntsu(2)) {
        this.includeFuro = furoJudgers.some(v => v)
        return true
      }
    }

    return false
  }
}
