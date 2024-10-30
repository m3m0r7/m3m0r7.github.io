import { MahjongOption, PaiName, Score } from "./types";
import { MahjongFulfilledYakuValidator } from "./Validator/MahjongFulfilledYakuValidator";
import { PaiCollection, PaiPairCollection } from "./Collection";
import { Futei } from "./Fu/Futei";
import { MahjongFulfilledFuValidator } from "./Validator/MahjongFulfilledFuValidator";
import { MahjongScoreCalculator } from "./MahjongScoreCalculator";

export class Mahjong {
  readonly option: Partial<MahjongOption> = {}
  private paiCollection: PaiCollection
  private paiPairCollections: PaiPairCollection[]
  private scoreCalculator: MahjongScoreCalculator

  constructor(paiList: PaiName[], option: Partial<MahjongOption> = {}) {
    this.option = option
    this.paiCollection = new PaiCollection(paiList)
    this.paiPairCollections = this.paiCollection.extract()
    this.scoreCalculator = new MahjongScoreCalculator(this, this.paiPairCollections)

    if (!this.scoreCalculator.isValid) {
      throw Error('The mahjong scores are not available that reason for Yaku are not fulfilled, invalid format and so on')
    }
  }


}

export default {}
