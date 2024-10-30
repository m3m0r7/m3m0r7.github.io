import { Fu, MahjongOption, Toitsu, Yaku } from "../types";
import { PaiPairCollection } from "../Collection";
import { PaiPatternExtractor } from "../Extractor";

export class MenFonPai implements Fu {
  private paiPairCollection: PaiPairCollection
  private option: Partial<MahjongOption>

  constructor(paiPairCollection: PaiPairCollection, _yaku: Yaku[], option: Partial<MahjongOption> = {}) {
    this.paiPairCollection = paiPairCollection
    this.option = option
  }

  get value() {
    const pattern = this.paiPairCollection.jantou.pattern

    if (!PaiPatternExtractor.shouldToitsu(pattern)) {
      return 0
    }

    return this.option.jikaze && pattern.includes(this.option.jikaze)
      ? 2
      : 0
  }

  get isFulfilled(): boolean {
    return this.value > 0
  }
}
