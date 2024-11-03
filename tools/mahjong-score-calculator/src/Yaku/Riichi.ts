import { MahjongOption, Yaku } from "../@types/types";
import { PaiPairCollection } from "../Collection/Collection";
import { PaiGenerator } from "../Utilities/PaiGenerator";
import { JunChanta } from "./JunChanta";
import { DoubleRiichi } from "./DoubleRiichi";

export class Riichi implements Yaku {
  private paiPairCollection: PaiPairCollection;
  private option: MahjongOption;

  constructor(paiPairCollection: PaiPairCollection, option: MahjongOption) {
    this.paiPairCollection = paiPairCollection;
    this.option = option;
  }

  get type(): Yaku["type"] {
    return "NORMAL";
  }

  get han(): number {
    return 1;
  }

  get parent(): Yaku {
    return new DoubleRiichi(this.paiPairCollection, this.option);
  }

  get isFulfilled(): boolean {
    return (
      !this.paiPairCollection.hasFuro &&
      this.option.additionalSpecialYaku.withRiichi
    );
  }
}
