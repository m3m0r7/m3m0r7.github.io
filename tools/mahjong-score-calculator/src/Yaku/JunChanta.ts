import { MahjongOption, Yaku } from "../@types/types";
import { PaiPairCollection } from "../Collection/Collection";
import { PaiGenerator } from "../Utilities/PaiGenerator";

export class JunChanta implements Yaku {
  private paiPairCollection: PaiPairCollection

  constructor(paiPairCollection: PaiPairCollection, _: MahjongOption) {
    this.paiPairCollection = paiPairCollection
  }

  get type(): Yaku['type'] {
    return 'NORMAL'
  }

  get han(): number {
    return this.paiPairCollection.hasFuro
      ? 2
      : 3
  }

  get isFulfilled(): boolean {
    return this.paiPairCollection.paiPairs
      .every(
        paiPair => (paiPair.isJantou && paiPair.pattern.includesWithMatrix(PaiGenerator.generateRoutouHai()))
          || (paiPair.isShuntsu && PaiGenerator.generatePenchanHai().some(paiNames => paiPair.pattern.includesWithMatrix(paiNames, 'AND')))
          || (paiPair.isKoutsu && paiPair.pattern.includesWithMatrix(PaiGenerator.generateRoutouHai()))
      )
  }
}
