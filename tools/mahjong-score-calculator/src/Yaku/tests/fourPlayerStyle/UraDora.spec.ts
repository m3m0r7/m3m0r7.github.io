import '../../../Utilities/Utilities';
import { describe, expect, test } from "vitest";
import { Mahjong } from "../../../Runtime/Mahjong";
import I18n from "../../../Lang/I18n";
import { PaiName } from "../../../@types/types";
import { Ankou, Futei, MenzenKafu, Minkou, Tsumo } from "../../../Fu";
import { UraDora } from "../../UraDora";
import { Haku } from "../../Haku";
import { Riichi } from "../../Riichi";
import { MahjongDefaultAdditionalSpecialYaku } from "../../../Runtime/MahjongDefaultOption";
import { MenzenTsumo } from "../../MenzenTsumo";

const uraDoraExampleFormat: PaiName[] = [
  "1m", "2m", "3m",
  "5m", "6m", "7m",

  "3p", "4p", "5p",
  "4z", "4z", "4z",

  "2s", "2s",
]

describe('UraDora', () => {
  describe('fulfilled', () => {
    describe('parent', () => {
      test('tsumo', () => {
        const score = new Mahjong(
          uraDoraExampleFormat,
          {
            hora: {
              pai: "2s",
              fromTsumo: true,
              fromRon: false,

              fromRinshanPai: false,
            },

            additionalSpecialYaku: {
              ...MahjongDefaultAdditionalSpecialYaku,
              withRiichi: true,
            },

            uraDoraList: [
              "2s",
            ],

            // NOTE: Here is same of a mahjong parent
            jikaze: "1z",
            kaze: "1z",
          }).score.fourPlayerStyleScore

        expect(score?.score).deep.eq({ base: 11600, child: 3900 })
        expect(score?.honba).eq(0)
        expect(score?.fu).eq(30)
        expect(score?.yaku).eq(4)
        expect(score?.appliedFuList).deep.eq([
          {
            isDoubleYakuman: false,
            isFu: true,
            isYakuman: false,
            name: I18n.ja.fu[Futei.name],
            score: 20,
          },
          {
            isDoubleYakuman: false,
            isFu: true,
            isYakuman: false,
            name: I18n.ja.fu[Ankou.name],
            score: 8,
          },
          {
            isDoubleYakuman: false,
            isFu: true,
            isYakuman: false,
            name: I18n.ja.fu[Tsumo.name],
            score: 2,
          },
        ])
        expect(score?.appliedYakuList).deep.eq([
          {
            isDoubleYakuman: false,
            isFu: false,
            isYakuman: false,
            name: I18n.ja.yaku[Riichi.name],
            score: 1,
            calculationBasedScore: 1,
          },
          {
            isDoubleYakuman: false,
            isFu: false,
            isYakuman: false,
            name: I18n.ja.yaku[UraDora.name],
            score: 2,
            calculationBasedScore: 2,
          },
          {
            isDoubleYakuman: false,
            isFu: false,
            isYakuman: false,
            name: I18n.ja.yaku[MenzenTsumo.name],
            score: 1,
            calculationBasedScore: 1,
          },
        ])

      })
      test('ron', () => {
        const score = new Mahjong(
          uraDoraExampleFormat,
          {
            hora: {
              pai: "2s",
              fromTsumo: false,
              fromRon: true,

              fromRinshanPai: false,
            },

            additionalSpecialYaku: {
              ...MahjongDefaultAdditionalSpecialYaku,
              withRiichi: true,
            },

            uraDoraList: [
              "2s",
            ],

            // NOTE: Here is same of a mahjong parent
            jikaze: "1z",
            kaze: "1z",
          }).score.fourPlayerStyleScore

        expect(score?.score).deep.eq({ base: 7700 })
        expect(score?.honba).eq(0)
        expect(score?.fu).eq(40)
        expect(score?.yaku).eq(3)
        expect(score?.appliedFuList).deep.eq([
          {
            isDoubleYakuman: false,
            isFu: true,
            isYakuman: false,
            name: I18n.ja.fu[Futei.name],
            score: 20,
          },
          {
            isDoubleYakuman: false,
            isFu: true,
            isYakuman: false,
            name: I18n.ja.fu[Ankou.name],
            score: 8,
          },
          {
            isDoubleYakuman: false,
            isFu: true,
            isYakuman: false,
            name: I18n.ja.fu[MenzenKafu.name],
            score: 10,
          },
        ])
        expect(score?.appliedYakuList).deep.eq([
          {
            isDoubleYakuman: false,
            isFu: false,
            isYakuman: false,
            name: I18n.ja.yaku[Riichi.name],
            score: 1,
            calculationBasedScore: 1,
          },
          {
            isDoubleYakuman: false,
            isFu: false,
            isYakuman: false,
            name: I18n.ja.yaku[UraDora.name],
            score: 2,
            calculationBasedScore: 2,
          },
        ])

      })
    })

    describe('child', () => {
      test('tsumo', () => {
        const score = new Mahjong(
          uraDoraExampleFormat,
          {
            hora: {
              pai: "2s",
              fromTsumo: true,
              fromRon: false,

              fromRinshanPai: false,
            },

            additionalSpecialYaku: {
              ...MahjongDefaultAdditionalSpecialYaku,
              withRiichi: true,
            },

            uraDoraList: [
              "2s",
            ],

            jikaze: "2z",
            kaze: "1z",
          }).score.fourPlayerStyleScore

        expect(score?.score).deep.eq({ base: 7700, parent: 3900, child: 2000 })
        expect(score?.honba).eq(0)
        expect(score?.fu).eq(30)
        expect(score?.yaku).eq(4)
        expect(score?.appliedFuList).deep.eq([
          {
            isDoubleYakuman: false,
            isFu: true,
            isYakuman: false,
            name: I18n.ja.fu[Futei.name],
            score: 20,
          },
          {
            isDoubleYakuman: false,
            isFu: true,
            isYakuman: false,
            name: I18n.ja.fu[Ankou.name],
            score: 8,
          },
          {
            isDoubleYakuman: false,
            isFu: true,
            isYakuman: false,
            name: I18n.ja.fu[Tsumo.name],
            score: 2,
          },
        ])
        expect(score?.appliedYakuList).deep.eq([
          {
            isDoubleYakuman: false,
            isFu: false,
            isYakuman: false,
            name: I18n.ja.yaku[Riichi.name],
            score: 1,
            calculationBasedScore: 1,
          },
          {
            isDoubleYakuman: false,
            isFu: false,
            isYakuman: false,
            name: I18n.ja.yaku[UraDora.name],
            score: 2,
            calculationBasedScore: 2,
          },
          {
            isDoubleYakuman: false,
            isFu: false,
            isYakuman: false,
            name: I18n.ja.yaku[MenzenTsumo.name],
            score: 1,
            calculationBasedScore: 1,
          },
        ])

      })
      test('ron', () => {
        const score = new Mahjong(
          uraDoraExampleFormat,
          {
            hora: {
              pai: "2s",
              fromTsumo: false,
              fromRon: true,

              fromRinshanPai: false,
            },

            additionalSpecialYaku: {
              ...MahjongDefaultAdditionalSpecialYaku,
              withRiichi: true,
            },

            uraDoraList: [
              "2s",
            ],

            jikaze: "2z",
            kaze: "1z",
          }).score.fourPlayerStyleScore

        expect(score?.score).deep.eq({ base: 5200 })
        expect(score?.honba).eq(0)
        expect(score?.fu).eq(40)
        expect(score?.yaku).eq(3)
        expect(score?.appliedFuList).deep.eq([
          {
            isDoubleYakuman: false,
            isFu: true,
            isYakuman: false,
            name: I18n.ja.fu[Futei.name],
            score: 20,
          },
          {
            isDoubleYakuman: false,
            isFu: true,
            isYakuman: false,
            name: I18n.ja.fu[Ankou.name],
            score: 8,
          },
          {
            isDoubleYakuman: false,
            isFu: true,
            isYakuman: false,
            name: I18n.ja.fu[MenzenKafu.name],
            score: 10,
          },
        ])
        expect(score?.appliedYakuList).deep.eq([
          {
            isDoubleYakuman: false,
            isFu: false,
            isYakuman: false,
            name: I18n.ja.yaku[Riichi.name],
            score: 1,
            calculationBasedScore: 1,
          },
          {
            isDoubleYakuman: false,
            isFu: false,
            isYakuman: false,
            name: I18n.ja.yaku[UraDora.name],
            score: 2,
            calculationBasedScore: 2,
          },
        ])

      })


      test('with furo', () => {
        const score = () => {
          const mahjong = new Mahjong(
            uraDoraExampleFormat,
            {
              hora: {
                pai: "2s",
                fromTsumo: false,
                fromRon: true,

                fromRinshanPai: false,
              },

              additionalSpecialYaku: {
                ...MahjongDefaultAdditionalSpecialYaku,
                withRiichi: true,
              },

              uraDoraList: [
                "2s",
              ],

              jikaze: "2z",
              kaze: "1z",
            })

          mahjong.updatePaiPairCollections((paiPairCollection) => {
            paiPairCollection.paiPairs.map(paiPair => {
              paiPair.isFuro = true
              return paiPair
            })
            return paiPairCollection
          })

          return mahjong.score.fourPlayerStyleScore
        }
        expect(score).toThrow('The mahjong scores are not available that reason for Yaku are not fulfilled, invalid format and so on')
      })
    })
  })
})
