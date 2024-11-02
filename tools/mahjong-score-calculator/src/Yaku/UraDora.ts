import { MahjongOption, PaiName, Yaku } from "../@types/types";
import { PaiPairCollection } from "../Collection/Collection";

export class UraDora implements Yaku {
  private paiPairCollection: PaiPairCollection
  private option: MahjongOption

  constructor(paiPairCollection: PaiPairCollection, option: MahjongOption) {
    this.paiPairCollection = paiPairCollection
    this.option = option
  }

  get type(): Yaku['type'] {
    return 'NORMAL'
  }

  get availableHora(): boolean {
    // NOTE: A dora is not available hora, if you need to hora, and then you need to have other a yaku.
    return false
  }

  get han(): number {
    let doraCount = 0

    for (let i = 0; i < this.paiPairCollection.paiPairs.length; i++) {
      const paiPair = this.paiPairCollection.paiPairs[i]
      for (let j = 0; j < paiPair.pattern.length; j++) {
        const paiName: PaiName = paiPair.pattern[j];
        if (this.option.uraDoraList.includes(paiName)) {
          doraCount++
        }
      }
    }

    return doraCount;
  }

  get isFulfilled(): boolean {
    return (this.option.additionalSpecialYaku.withRiichi || this.option.additionalSpecialYaku.withOpenRiichi || this.option.additionalSpecialYaku.withDoubleRiichi) && this.han > 0
  }
}
