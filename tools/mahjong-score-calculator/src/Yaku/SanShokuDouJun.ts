import {
  Koutsu,
  MahjongOption,
  Pai,
  PaiName,
  PaiPair,
  Shuntsu,
  Yaku,
} from "../@types/types";
import { PaiPairCollection } from "../Collection/Collection";
import { RyanPeiKou } from "./RyanPeiKou";
import { PaiPatternExtractor } from "../Runtime/Extractor/Extractor";
import { PaiGenerator } from "../Utilities/PaiGenerator";

export class SanShokuDouJun implements Yaku {
  private paiPairCollection: PaiPairCollection;
  private option: MahjongOption;
  private includeFuro: boolean = false;

  constructor(paiPairCollection: PaiPairCollection, option: MahjongOption) {
    this.paiPairCollection = paiPairCollection;
    this.option = option;
  }

  get type(): Yaku["type"] {
    return "NORMAL";
  }

  get han(): number {
    return this.includeFuro ? 1 : 2;
  }

  get isFulfilled(): boolean {
    const contains = (paiNames: Shuntsu) =>
      this.paiPairCollection.paiPairs.some((paiPair) => {
        const result =
          paiPair.isShuntsu &&
          paiPair.pattern.includesWithMatrix(paiNames, "AND");
        if (result && paiPair.isFuro) {
          this.includeFuro = true;
        }
        return result;
      });

    for (let i = 0; i < this.paiPairCollection.paiPairs.length; i++) {
      const targetPaiPair = this.paiPairCollection.paiPairs[i];
      if (!targetPaiPair.isShuntsu) {
        continue;
      }

      const [aNumber] = PaiPatternExtractor.extractPaiPair(
        targetPaiPair.pattern[0],
      );
      const [bNumber] = PaiPatternExtractor.extractPaiPair(
        targetPaiPair.pattern[1],
      );
      const [cNumber] = PaiPatternExtractor.extractPaiPair(
        targetPaiPair.pattern[2],
      );

      const shuntsuManzu: Shuntsu = [
        `${aNumber}m`,
        `${bNumber}m`,
        `${cNumber}m`,
      ] as Shuntsu;
      const shuntsuPinzu: Shuntsu = [
        `${aNumber}p`,
        `${bNumber}p`,
        `${cNumber}p`,
      ] as Shuntsu;
      const shuntsuSouzu: Shuntsu = [
        `${aNumber}s`,
        `${bNumber}s`,
        `${cNumber}s`,
      ] as Shuntsu;

      if (
        contains(shuntsuManzu) &&
        contains(shuntsuPinzu) &&
        contains(shuntsuSouzu)
      ) {
        return true;
      }
    }
    return false;
  }
}
