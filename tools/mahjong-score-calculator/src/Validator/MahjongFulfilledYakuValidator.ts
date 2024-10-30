import { Validator, Yaku } from "../types";
import { PaiPairCollection } from "../Collection";
import { MahjongFormatValidator } from "./MahjongFormatValidator";
import {
  Tanyao,
  Chanta,
  Honitsu,
  Pinfu,
} from '../Yaku'

export class MahjongFulfilledYakuValidator implements Validator {
  readonly paiPairCollection: PaiPairCollection

  private yakuList = [
    Tanyao,
    Chanta,
    Honitsu,
    Pinfu,
  ];

  private _fulfilled: Yaku[] = []

  constructor(paiPairCollection: PaiPairCollection) {
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

    for (const yakuName of this.yakuList) {
      let processor: Yaku = new yakuName(this.paiPairCollection)
      let record: Yaku | null = null

      do {
        if (processor.isFulfilled) {
          record = processor
        }
        if (processor.parent === null) {
          break;
        }
        processor = processor.parent
      } while (processor)

      if (record !== null) {
        this._fulfilled.push(record)
      }
    }

    return this._fulfilled.length > 0
  }
}

export default {}
