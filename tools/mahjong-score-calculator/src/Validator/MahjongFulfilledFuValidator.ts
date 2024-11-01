import { Fu, MahjongOption, Validator, Yaku } from "../@types/types";
import { PaiPairCollection } from "../Collection/Collection";
import { MahjongFormatValidator } from "./MahjongFormatValidator";

export class MahjongFulfilledFuValidator implements Validator {
  readonly paiPairCollection: PaiPairCollection
  private yakuList: Yaku[]
  private option: MahjongOption

  private _fulfilled: Fu[] = []

  constructor(paiPairCollection: PaiPairCollection, yakuList: Yaku[], option: MahjongOption) {
    this.option = option
    this.yakuList = yakuList
    this.paiPairCollection = paiPairCollection
  }

  get fulfilled() {
    return this._fulfilled
  }

  validate(): boolean {
    if (this.paiPairCollection.paiPairs.length === 0) {
      return false
    }

    if (!(new MahjongFormatValidator(this.paiPairCollection)).validate()) {
      return false
    }

    // NOTE: No calculate fu when fulfilling each of yakuman
    if (this.yakuList.find(yaku => yaku.type === 'FULL' || yaku.type === 'DOUBLE_FULL')) {
      return true
    }

    for (const fuName of this.option.fuList) {
      let processor: Fu = new fuName(this.paiPairCollection, this.yakuList, this.option)

      if (processor.isFulfilled) {
        this._fulfilled.push(processor)
      }
    }

    return true
  }
}

export default {}
