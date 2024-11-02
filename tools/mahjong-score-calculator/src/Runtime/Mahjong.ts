import { MahjongOption, PaiName } from "../@types/types";
import { PaiCollection, PaiPairCollection } from "../Collection/Collection";
import { MahjongFourPlayerStyleScoreCalculator } from "./Score/MahjongFourPlayerStyleScoreCalculator";
import { MahjongDefaultAdditionalSpecialYaku, MahjongDefaultOption } from "./MahjongDefaultOption";
import { MahjongHaiTypeValidator } from "../Validator/MahjongHaiTypeValidator";
import { PaiListFormatAreInvalidError } from "../Error/PaiListFormatAreInvalidError";
import { MahjongScoreCalculator } from "./Score/MahjongScoreCalculator";

export class Mahjong {
  readonly option: MahjongOption
  private _paiPairCollections: PaiPairCollection[]
  private paiCollection: PaiCollection
  private scoreCalculator: MahjongFourPlayerStyleScoreCalculator | null = null

  constructor(paiList: PaiName[], option: Partial<MahjongOption> = {}) {
    this.option = Object.assign<MahjongOption, typeof option>({
      ...MahjongDefaultOption,
      hora: {
        pai: paiList[paiList.length - 1],
        fromRon: false,
        fromTsumo: false,
        fromRinshanPai: false,
        fromTankiMachi: false,
      },
      honba: 0,
      kaze: "1z",
      jikaze: "1z",
      doraList: [],
      uraDoraList: [],
      localRules: {
        fu: {
          renfonPai: 4,
        },
        honba: 300,
        kuitan: true,
        ...MahjongDefaultOption.localRules,
      },
      fuList: MahjongDefaultOption.fuList ?? [],
      yakuList: MahjongDefaultOption.yakuList ?? [],
      enableDoubleYakuman: true,
      logger: (...message: string[]) => console.info(...message),
      additionalSpecialYaku: MahjongDefaultAdditionalSpecialYaku,
    }, option)

    if (!(new MahjongHaiTypeValidator(paiList, this.option)).validate()) {
      throw new PaiListFormatAreInvalidError('PaiTypes are invalid')
    }

    this.paiCollection = new PaiCollection(paiList)
    this._paiPairCollections = this.paiCollection.extract()
  }

  get paiPairCollections() {
    return this._paiPairCollections
  }

  updatePaiPairCollections(paiPairCollectionFilter: (paiPairCollection: PaiPairCollection) => PaiPairCollection) {
    this._paiPairCollections = this._paiPairCollections.map(paiPairCollection => paiPairCollectionFilter(paiPairCollection))
  }

  get score() {
    return new MahjongScoreCalculator(this, this.paiPairCollections)
  }
}

export default {}