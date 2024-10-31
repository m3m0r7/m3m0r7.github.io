import { Fu, Hora, MahjongOption, Pai, PaiName, Score, Yaku } from "./types";
import { MahjongFulfilledYakuValidator } from "./Validator/MahjongFulfilledYakuValidator";
import { PaiCollection, PaiPairCollection } from "./Collection";
import { Futei } from "./Fu/Futei";
import { MahjongFulfilledFuValidator } from "./Validator/MahjongFulfilledFuValidator";
import { MahjongScoreCalculator } from "./MahjongScoreCalculator";
import { Chanta, Haitei, Honitsu, Houtei, OpenRiichi, Pinfu, Riichi, RinshanKaiho, Tanyao } from "./Yaku";
import { Ankan, Ankou, ChanFonPai, MenFonPai, MenzenKafu, Minkan, Minkou, RenFonPai, SangenPai, Tsumo } from "./Fu";
import { MahjongDefaultOption } from "./MahjongDefaultOption";

export class Mahjong {
  readonly option: MahjongOption
  private paiCollection: PaiCollection
  private paiPairCollections: PaiPairCollection[]
  private scoreCalculator: MahjongScoreCalculator

  constructor(paiList: PaiName[], option: Partial<MahjongOption> = {}) {
    this.option = Object.assign<MahjongOption, typeof option>({
      ...MahjongDefaultOption,
      hora: {
        pai: paiList[paiList.length - 1],
        fromRon: false,
        fromTsumo: false,
        fromRinshanPai: false,
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
        withKokushiMusou13MenMachi: false,
      },
    }, option)
    this.paiCollection = new PaiCollection(paiList)
    this.paiPairCollections = this.paiCollection.extract()
    this.scoreCalculator = new MahjongScoreCalculator(this, this.paiPairCollections)

    if (!this.scoreCalculator.isValid) {
      throw Error('The mahjong scores are not available that reason for Yaku are not fulfilled, invalid format and so on')
    }
  }


}

export default {}
