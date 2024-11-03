import { Fu, MahjongOption, Yaku } from "../@types/types";
import { PaiPairCollection } from "../Collection/Collection";
import { PaiPatternExtractor } from "../Runtime/Extractor/Extractor";

export class ChanFonPai implements Fu {
  private paiPairCollection: PaiPairCollection;
  private option: MahjongOption;

  constructor(
    paiPairCollection: PaiPairCollection,
    _yaku: Yaku[],
    option: MahjongOption,
  ) {
    this.paiPairCollection = paiPairCollection;
    this.option = option;
  }

  get value() {
    const pattern = this.paiPairCollection.jantou.pattern;

    if (!PaiPatternExtractor.shouldToitsu(pattern)) {
      return 0;
    }

    return this.option.kaze &&
      this.option.kaze !== this.option.jikaze &&
      pattern.includes(this.option.kaze)
      ? 2
      : 0;
  }

  get isFulfilled(): boolean {
    return this.value > 0;
  }
}
