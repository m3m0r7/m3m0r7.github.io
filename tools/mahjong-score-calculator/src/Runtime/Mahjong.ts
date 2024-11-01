import { Fu, Hora, MahjongOption, Pai, PaiName, Score, Yaku } from "../@types/types";
import { MahjongFulfilledYakuValidator } from "../Validator/MahjongFulfilledYakuValidator";
import { PaiCollection, PaiPairCollection } from "../Collection/Collection";
import { Futei } from "../Fu/Futei";
import { MahjongFulfilledFuValidator } from "../Validator/MahjongFulfilledFuValidator";
import { MahjongScoreCalculator } from "./Score/MahjongScoreCalculator";
import { Chanta, Haitei, Honitsu, Houtei, OpenRiichi, Pinfu, Riichi, RinshanKaihou, Tanyao } from "../Yaku";
import { Ankan, Ankou, ChanFonPai, MenFonPai, MenzenKafu, Minkan, Minkou, RenFonPai, SangenPai, Tsumo } from "../Fu";
import { MahjongDefaultOption } from "./MahjongDefaultOption";
import { MahjongHaiTypeValidator } from "../Validator/MahjongHaiTypeValidator";
import { PaiListFormatAreInvalidError } from "../Error/PaiListFormatAreInvalidError";
import { CannotCalculateScoreError } from "../Error/CannotCalculateScoreError";

export class Mahjong {
  readonly option: MahjongOption
  private _paiPairCollections: PaiPairCollection[]
  private paiCollection: PaiCollection
  private scoreCalculator: MahjongScoreCalculator | null = null

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
      },
      fuList: MahjongDefaultOption.fuList ?? [],
      yakuList: MahjongDefaultOption.yakuList ?? [],
      enableDoubleYakuman: true,
      additionalSpecialYaku: {
        withRiichi: false,
        withDoubleRiichi: false,
        withOpenRiichi: false,
        withIppatsu: false,
        withHaitei: false,
        withHoutei: false,
        withChanKan: false,
        withTenho: false,
        withChiho: false,
        withNagashiMangan: false
      },
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
    this.scoreCalculator = new MahjongScoreCalculator(this, this._paiPairCollections)

    if (!this.scoreCalculator.isValid) {
      throw new CannotCalculateScoreError('The mahjong scores are not available that reason for Yaku are not fulfilled, invalid format and so on')
    }

    return this.scoreCalculator.score
  }


}

export default {}
