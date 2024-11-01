import { MahjongOption, PaiGroupName, PaiName, Yaku } from "../@types/types";
import { PaiPairCollection } from "../Collection/Collection";
import { PaiGenerator } from "../Utilities/PaiGenerator";
import { PaiPatternExtractor } from "../Runtime/Extractor/Extractor";

export class KokushiMusou13MenMachi implements Yaku {
  private paiPairCollection: PaiPairCollection
  private option: MahjongOption

  constructor(paiPairCollection: PaiPairCollection, option: MahjongOption) {
    this.paiPairCollection = paiPairCollection
    this.option = option
  }

  get type(): Yaku['type'] {
    return 'DOUBLE_FULL'
  }

  get isFulfilled(): boolean {
    if (!this.option.enableDoubleYakuman) {
      return false
    }

    for (const waitingPai of PaiGenerator.generateKokushiMusou13MenMachi()) {
      const flatPaiPair = this.paiPairCollection.flat()

      const paiNames = [
        ...PaiGenerator.generateKokushiMusou13MenMachi(),

        // NOTE: Appended a pai
        waitingPai,
      ] as PaiName[];

      const sortedByNonShuntsuFriendly = PaiPatternExtractor.sortByPaiName(paiNames, false)
      const sortedByShuntsuFriendly = PaiPatternExtractor.sortByPaiName(paiNames, false)

      if (this.option.hora.pai === waitingPai && (flatPaiPair.includesWithMatrix(sortedByNonShuntsuFriendly, 'AND') || flatPaiPair.includesWithMatrix(sortedByShuntsuFriendly, 'AND'))) {
        return true
      }
    }

    return false
  }
}
