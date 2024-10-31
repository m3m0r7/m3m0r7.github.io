import { Koutsu, MahjongOption, Pai, PaiName, PaiPair, Yaku } from "../types";
import { PaiPairCollection } from "../Collection";
import { RyanPeiKou } from "./RyanPeiKou";
import { PaiPatternExtractor } from "../Extractor";
import { PaiGenerator } from "../PaiGenerator";

export class SanShokuDouJun implements Yaku {
  private paiPairCollection: PaiPairCollection
  private option: MahjongOption
  private includeFuro: boolean = false

  constructor(paiPairCollection: PaiPairCollection, option: MahjongOption) {
    this.paiPairCollection = paiPairCollection
    this.option = option
  }

  get type(): Yaku['type'] {
    return 'NORMAL'
  }

  get han(): number {
    return this.includeFuro
      ? 1
      : 2
  }

  get isFulfilled(): boolean {
    const contains = (paiNames: Koutsu) => this.paiPairCollection.paiPairs
      .some(paiPair => {
        const result = paiPair.isShuntsu && paiPair.pattern.includesWithMatrix(paiNames, 'AND')
        if (result && paiPair.isFuro) {
          this.includeFuro = true
        }
        return result
      })

    for (let i = 0; i < this.paiPairCollection.paiPairs.length; i++) {
      const targetPaiPair = this.paiPairCollection.paiPairs[i];
      if (!targetPaiPair.isShuntsu) {
        continue
      }

      const [aNumber] = PaiPatternExtractor.extractPaiPair(targetPaiPair.pattern[0])
      const [bNumber] = PaiPatternExtractor.extractPaiPair(targetPaiPair.pattern[1])
      const [cNumber] = PaiPatternExtractor.extractPaiPair(targetPaiPair.pattern[2])

      const shuntsuManzu: Koutsu = [`${aNumber}m`, `${bNumber}m`, `${cNumber}m`] as Koutsu
      const shuntsuPinzu: Koutsu = [`${aNumber}p`, `${bNumber}p`, `${cNumber}p`] as Koutsu
      const shuntsuSouzu: Koutsu = [`${aNumber}s`, `${bNumber}s`, `${cNumber}s`] as Koutsu

      if (contains(shuntsuManzu) && contains(shuntsuPinzu) && contains(shuntsuSouzu)) {
        return true
      }
    }
    return false
  }
}
