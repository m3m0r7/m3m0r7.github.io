import { MahjongOption, Validator, Yaku } from "../@types/types";
import { PaiPairCollection } from "../Collection/Collection";
import { MahjongFormatValidator } from "./MahjongFormatValidator";
import { JantouNotFoundError } from "../Error/JantouNotFoundError";

export class MahjongFulfilledYakuValidator implements Validator {
  readonly paiPairCollection: PaiPairCollection;
  private option: MahjongOption;

  private _fulfilled: Yaku[] = [];

  constructor(paiPairCollection: PaiPairCollection, option: MahjongOption) {
    this.paiPairCollection = paiPairCollection;
    this.option = option;
  }

  get fulfilled() {
    return this._fulfilled;
  }

  validate(): boolean {
    if (this.paiPairCollection.paiPairs.length === 0) {
      return false;
    }

    if (!new MahjongFormatValidator(this.paiPairCollection).validate()) {
      return false;
    }

    for (const yakuName of this.option.yakuList) {
      let processor: Yaku = new yakuName(this.paiPairCollection, this.option);
      let record: Yaku | null = null;

      try {
        do {
          if (processor.isFulfilled) {
            record = processor;
          }

          if (!processor.parent) {
            break;
          }
          processor = processor.parent;
        } while (processor);
      } catch (e) {
        // NOTE: for example, here will face a churen poutou
        if (e instanceof JantouNotFoundError) {
          continue;
        }

        throw e;
      }

      if (record !== null) {
        this._fulfilled.push(record);

        if (record.type === "FULL" || record.type === "DOUBLE_FULL") {
          // NOTE: Use short-circuit when found a yakuman
          break;
        }
      }
    }

    const yakuman = this._fulfilled.find(
      (yaku) => yaku.type === "FULL" || yaku.type === "DOUBLE_FULL",
    );
    if (yakuman) {
      // NOTE: Clear fulfilled records added before, and add only yakuman
      this._fulfilled = [yakuman];
    }

    return this._fulfilled.length > 0;
  }
}

export default {};
