import { MahjongOption, Yaku } from "../@types/types";
import { PaiPairCollection } from "../Collection/Collection";
import { PaiGenerator } from "../Utilities/PaiGenerator";
import { Haku } from "./Haku";
import { Hatsu } from "./Hatsu";
import { Chun } from "./Chun";

export class ShouSanGen implements Yaku {
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
    return 2;
  }

  get isFulfilled(): boolean {
    const jantou = this.paiPairCollection.jantou;
    if (!jantou.pattern.includesWithMatrix(PaiGenerator.generateSangenPai())) {
      return false;
    }

    const hakuIsFulFilled = new Haku(this.paiPairCollection, this.option)
      .isFulfilled;
    const hatsuIsFulFilled = new Hatsu(this.paiPairCollection, this.option)
      .isFulfilled;
    const chunIsFulFilled = new Chun(this.paiPairCollection, this.option)
      .isFulfilled;

    return (
      (hakuIsFulFilled && hatsuIsFulFilled) ||
      (hatsuIsFulFilled && chunIsFulFilled) ||
      (chunIsFulFilled && hakuIsFulFilled)
    );
  }
}
