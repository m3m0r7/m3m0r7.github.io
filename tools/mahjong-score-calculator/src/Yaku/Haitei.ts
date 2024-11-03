import { MahjongOption, Yaku } from "../@types/types";
import { PaiPairCollection } from "../Collection/Collection";
import { PaiGenerator } from "../Utilities/PaiGenerator";
import { JunChanta } from "./JunChanta";

export class Haitei implements Yaku {
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

  get isFulfilled(): boolean {
    return (
      this.option.additionalSpecialYaku.withHaitei && this.option.hora.fromTsumo
    );
  }
}
