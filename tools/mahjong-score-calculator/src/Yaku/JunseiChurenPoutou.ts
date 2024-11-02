import { MahjongOption, PaiGroupName, PaiName, Yaku } from "../@types/types";
import { PaiPairCollection } from "../Collection/Collection";
import { PaiPatternExtractor } from "../Runtime/Extractor/Extractor";
import { PaiGenerator } from "../Utilities/PaiGenerator";

export class JunseiChurenPoutou implements Yaku {
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

    // NOTE: The churen poutou is available to menzen only
    if (this.paiPairCollection.hasFuro) {
      return false;
    }

    for (const groupName of ['m', 'p', 's'] as PaiGroupName[]) {
      const flatPaiPair = this.paiPairCollection.flat()

      for (let i = 1; i <= 9; i++) {
        const paiNames = [
          ...PaiGenerator.generateChurenPoutou9MenMachi(groupName),

          // NOTE: Appended a pai
          `${i}${groupName}`
        ] as PaiName[];

        const sortedByNonShuntsuFriendly = PaiPatternExtractor.sortByPaiName(paiNames, false)
        const sortedByShuntsuFriendly = PaiPatternExtractor.sortByPaiName(paiNames, true)

        if (this.option.hora.pai === `${i}${groupName}` && (flatPaiPair.same(sortedByNonShuntsuFriendly) || flatPaiPair.same(sortedByShuntsuFriendly))) {
          return true
        }
      }
    }

    return false
  }
}
