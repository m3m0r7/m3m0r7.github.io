import { MahjongOption, Yaku } from "../@types/types";
import { PaiPairCollection } from "../Collection/Collection";
import { PaiGenerator } from "../Utilities/PaiGenerator";
import { Chinitsu } from "./Chinitsu";
import { PaiPatternExtractor } from "../Runtime/Extractor/Extractor";

export class IkkiTsuukan implements Yaku {
  private paiPairCollection: PaiPairCollection
  private option: MahjongOption

  constructor(paiPairCollection: PaiPairCollection, option: MahjongOption) {
    this.paiPairCollection = paiPairCollection
    this.option = option
  }

  get type(): Yaku['type'] {
    return 'NORMAL'
  }

  get han(): number {
    return this.paiPairCollection.hasFuro
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
      if (this.paiPairCollection.paiPairs.some(paiPair => paiPair.pattern.same(pattern[0]))
        && this.paiPairCollection.paiPairs.some(paiPair => paiPair.pattern.same(pattern[1]))
        && this.paiPairCollection.paiPairs.some(paiPair => paiPair.pattern.same(pattern[2]))
      ) {
        return true
      }
    }

    return false
  }
}
