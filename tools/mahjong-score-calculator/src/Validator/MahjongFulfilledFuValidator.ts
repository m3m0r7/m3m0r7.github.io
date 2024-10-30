import { Fu, MahjongOption, Validator, Yaku } from "../types";
import { PaiPairCollection } from "../Collection";
import { MahjongFormatValidator } from "./MahjongFormatValidator";
import {
  Futei,
  Ankou,
  Minkou,
  Ankan,
  Minkan,
  Tsumo,
  MenzenKafu,
  MenFonPai,
  ChanFonPai,
  SangenPai,
  RenFonPai,
} from "../Fu";

export class MahjongFulfilledFuValidator implements Validator {
  readonly paiPairCollection: PaiPairCollection
  private yakuList: Yaku[]
  private option: Partial<MahjongOption>

  private fuList = [
    Futei,
    Ankou,
    Minkou,
    Ankan,
    Minkan,
    Tsumo,
    MenzenKafu,
    MenFonPai,
    ChanFonPai,
    SangenPai,
    RenFonPai,
  ];

  private _fulfilled: Fu[] = []

  constructor(paiPairCollection: PaiPairCollection, yakuList: Yaku[], option: Partial<MahjongOption> = {}) {
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

    for (const fuName of this.fuList) {
      let processor: Fu = new fuName(this.paiPairCollection, this.yakuList, this.option)

      if (processor.isFulfilled) {
        this._fulfilled.push(processor)
      }
    }

    return true
  }
}

export default {}
