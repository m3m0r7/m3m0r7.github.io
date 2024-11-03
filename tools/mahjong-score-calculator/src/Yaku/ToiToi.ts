import { MahjongOption, Yaku } from "../@types/types";
import { PaiPairCollection } from "../Collection/Collection";

export class ToiToi implements Yaku {
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
    return 2;
  }

  get isFulfilled(): boolean {
    return (
      this.paiPairCollection.hasFuro &&
      this.paiPairCollection.paiPairs
        .filter((v) => !v.isJantou)
        .every((paiPair) => paiPair.isKoutsu || paiPair.isKan)
    );
  }
}
