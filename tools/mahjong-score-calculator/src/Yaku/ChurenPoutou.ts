import { MahjongOption, PaiName, Yaku } from "../@types/types";
import { PaiPairCollection } from "../Collection/Collection";
import { PaiGenerator } from "../Utilities/PaiGenerator";

export class ChurenPoutou implements Yaku {
  private paiPairCollection: PaiPairCollection;
  private option: MahjongOption;

  constructor(paiPairCollection: PaiPairCollection, option: MahjongOption) {
    this.paiPairCollection = paiPairCollection;
    this.option = option;
  }

  get type(): Yaku["type"] {
    return "FULL";
  }

  get isFulfilled(): boolean {
    // NOTE: The churen poutou is available to menzen only
    if (this.paiPairCollection.hasFuro) {
      return false;
    }

    const m: PaiName[][] = this.paiPairCollection.paiPairs.map((paiPair) =>
      paiPair.pattern.diff(PaiGenerator.generateChurenPoutou9MenMachi("m")),
    );
    const p: PaiName[][] = this.paiPairCollection.paiPairs.map((paiPair) =>
      paiPair.pattern.diff(PaiGenerator.generateChurenPoutou9MenMachi("p")),
    );
    const s: PaiName[][] = this.paiPairCollection.paiPairs.map((paiPair) =>
      paiPair.pattern.diff(PaiGenerator.generateChurenPoutou9MenMachi("s")),
    );

    return (
      this.paiPairCollection.isChurenPoutou &&
      ((m[0].length === 1 && !m[0].includes(this.option.hora.pai)) ||
        (p[0].length === 1 && !p[0].includes(this.option.hora.pai)) ||
        (s[0].length === 1 && !s[0].includes(this.option.hora.pai)))
    );
  }
}
