import { MahjongOption, Yaku } from "../@types/types";
import { PaiPairCollection } from "../Collection/Collection";
import { PaiGenerator } from "../Utilities/PaiGenerator";
import { JunChanta } from "./JunChanta";

export class Chanta implements Yaku {
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

  get parent(): Yaku {
    return new JunChanta(this.paiPairCollection, this.option)
  }

  get isFulfilled(): boolean {
    return this.paiPairCollection.paiPairs
      .every(
        paiPair => (paiPair.isJantou && paiPair.pattern.includesWithMatrix(PaiGenerator.generateYaoChuHai()))
          || (paiPair.isShuntsu && PaiGenerator.generatePenchanHai().some(paiNames => paiPair.pattern.includesWithMatrix(paiNames, 'AND')))
          || (paiPair.isKoutsu && paiPair.pattern.includesWithMatrix(PaiGenerator.generateYaoChuHai()))
      )
  }
}
