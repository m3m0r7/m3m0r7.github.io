import { Fu, MahjongOption, Yaku } from "../types";
import { PaiPairCollection } from "../Collection";
import { PaiPatternExtractor } from "../Extractor";

export class RenFonPai implements Fu {
  private paiPairCollection: PaiPairCollection
  private option: MahjongOption

  constructor(paiPairCollection: PaiPairCollection, _yaku: Yaku[], option: MahjongOption) {
    this.paiPairCollection = paiPairCollection
    this.option = option
  }

  get value() {
    const pattern = this.paiPairCollection.jantou.pattern

    if (!PaiPatternExtractor.shouldToitsu(pattern)) {
      return 0
    }

    return this.option.kaze === this.option.jikaze && pattern.includes(this.option.kaze)
      // NOTE: Here is decided to calculate fu from a renfon pai. Default is 4 because it is based on mahjong official tournament rules.
      //       But I know, in some cases, that is calculated with 2.
      //       Of course, this is built-in option, and it is available to customize.
      ? this.option.localRules?.fu?.renfonPai ?? 4
      : 0
  }

  get isFulfilled(): boolean {
    return this.value > 0
  }
}
