import { MahjongOption, Yaku } from "../@types/types";
import { PaiPairCollection } from "../Collection/Collection";

export class Ippatsu implements Yaku {
  private paiPairCollection: PaiPairCollection;
  private option: MahjongOption;

  constructor(paiPairCollection: PaiPairCollection, option: MahjongOption) {
    this.paiPairCollection = paiPairCollection;
    this.option = option;
  }

  get type(): Yaku["type"] {
    return "NORMAL";
  }

  get availableHora(): boolean {
    return false;
  }

  get han(): number {
    return 1;
  }

  get isFulfilled(): boolean {
    return (
      (this.option.additionalSpecialYaku.withOpenRiichi ||
        this.option.additionalSpecialYaku.withDoubleRiichi ||
        this.option.additionalSpecialYaku.withRiichi) &&
      this.option.additionalSpecialYaku.withIppatsu
    );
  }
}
