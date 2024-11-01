import { MahjongOption, Pai, PaiName, PaiPair, Yaku } from "../@types/types";
import { PaiPairCollection } from "../Collection/Collection";
import { RyanPeiKou } from "./RyanPeiKou";
import { PaiPatternExtractor } from "../Runtime/Extractor/Extractor";
import { PaiGenerator } from "../Utilities/PaiGenerator";

export class SanShokuDouKou implements Yaku {
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
    return 2
  }

  get isFulfilled(): boolean {
    for (let i = 0; i < this.paiPairCollection.paiPairs.length; i++) {
      const targetPaiPair = this.paiPairCollection.paiPairs[i];
      if (!targetPaiPair.isKoutsu && !targetPaiPair.isKan) {
        continue
      }

      const [aNumber, aGroup] = PaiPatternExtractor.extractPaiPair(targetPaiPair.pattern[0])
      const koutsuManzu: PaiName = `${aNumber}m` as PaiName
      const koutsuPinzu: PaiName = `${aNumber}p` as PaiName
      const koutsuSouzu: PaiName = `${aNumber}s` as PaiName

      if (this.paiPairCollection.containsKoutsuOrKan(koutsuManzu) && this.paiPairCollection.containsKoutsuOrKan(koutsuPinzu) && this.paiPairCollection.containsKoutsuOrKan(koutsuSouzu)) {
        return true
      }
    }
    return false
  }
}
