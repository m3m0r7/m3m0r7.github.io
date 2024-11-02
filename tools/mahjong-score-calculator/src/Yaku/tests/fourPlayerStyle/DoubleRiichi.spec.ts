import '../../../Utilities/Utilities';
import { describe, expect, test } from "vitest";
import { Mahjong } from "../../../Runtime/Mahjong";
import I18n from "../../../Lang/I18n";
import { PaiName } from "../../../@types/types";
import { Futei, MenzenKafu, Tsumo } from "../../../Fu";
import { DoubleRiichi } from "../../DoubleRiichi";
import { MahjongDefaultAdditionalSpecialYaku, MahjongDefaultOption } from "../../../Runtime/MahjongDefaultOption";

const doubleRiichiExampleFormat: PaiName[] = [
  "1m", "2m", "3m",
  "5m", "6m", "7m",

  "3p", "4p", "5p",
  "6p", "7p", "8p",

  "2s", "2s",
];

describe('DoubleRiichi', () => {
  describe('fulfilled', () => {
    describe('parent', () => {
      test('tsumo', () => {
        const score = new Mahjong(
          doubleRiichiExampleFormat,
          {
            hora: {
              pai: "2s",
              fromTsumo: true,
              fromRon: false,
              fromTankiMachi: false,
              fromRinshanPai: false,
            },

            // NOTE: Here is same of a mahjong parent
            jikaze: "1z",
            kaze: "1z",

            additionalSpecialYaku: {
              ...MahjongDefaultAdditionalSpecialYaku,
              withDoubleRiichi: true,
            }
          }).score.fourPlayerStyleScore

        expect(score?.score).deep.eq({ base: 2900, child: 1000 })
        expect(score?.honba).eq(0)
        expect(score?.fu).eq(30)
        expect(score?.yaku).eq(2)
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
            name: I18n.ja.fu[Tsumo.name],
            score: 2,
          },
        ])
        expect(score?.appliedYakuList).deep.eq([
          {
            isDoubleYakuman: false,
            isFu: false,
            isYakuman: false,
            name: I18n.ja.yaku[DoubleRiichi.name],
            score: 2,
            calculationBasedScore: 2,
          }
        ])

      })
      test('ron', () => {
        const score = new Mahjong(
          doubleRiichiExampleFormat,
          {
            hora: {
              pai: "2s",
              fromTsumo: false,
              fromRon: true,
              fromTankiMachi: false,
              fromRinshanPai: false,
            },

            // NOTE: Here is same of a mahjong parent
            jikaze: "1z",
            kaze: "1z",

            additionalSpecialYaku: {
              ...MahjongDefaultAdditionalSpecialYaku,
              withDoubleRiichi: true,
            }
          }).score.fourPlayerStyleScore

        expect(score?.score).deep.eq({ base: 2900 })
        expect(score?.honba).eq(0)
        expect(score?.fu).eq(30)
        expect(score?.yaku).eq(2)
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
            name: I18n.ja.fu[MenzenKafu.name],
            score: 10,
          },
        ])
        expect(score?.appliedYakuList).deep.eq([
          {
            isDoubleYakuman: false,
            isFu: false,
            isYakuman: false,
            name: I18n.ja.yaku[DoubleRiichi.name],
            score: 2,
            calculationBasedScore: 2,
          }
        ])

      })
    })

    describe('child', () => {
      test('tsumo', () => {
        const score = new Mahjong(
          doubleRiichiExampleFormat,
          {
            hora: {
              pai: "2s",
              fromTsumo: true,
              fromRon: false,
              fromTankiMachi: false,
              fromRinshanPai: false,
            },

            jikaze: "2z",
            kaze: "1z",

            additionalSpecialYaku: {
              ...MahjongDefaultAdditionalSpecialYaku,
              withDoubleRiichi: true,
            }
          }).score.fourPlayerStyleScore

        expect(score?.score).deep.eq({ base: 2000, parent: 1000, child: 500 })
        expect(score?.honba).eq(0)
        expect(score?.fu).eq(30)
        expect(score?.yaku).eq(2)
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
            name: I18n.ja.fu[Tsumo.name],
            score: 2,
          },
        ])
        expect(score?.appliedYakuList).deep.eq([
          {
            isDoubleYakuman: false,
            isFu: false,
            isYakuman: false,
            name: I18n.ja.yaku[DoubleRiichi.name],
            score: 2,
            calculationBasedScore: 2,
          }
        ])

      })
      test('ron', () => {
        const score = new Mahjong(
          doubleRiichiExampleFormat,
          {
            hora: {
              pai: "2s",
              fromTsumo: false,
              fromRon: true,
              fromTankiMachi: false,
              fromRinshanPai: false,
            },

            jikaze: "2z",
            kaze: "1z",

            additionalSpecialYaku: {
              ...MahjongDefaultAdditionalSpecialYaku,
              withDoubleRiichi: true,
            }
          }).score.fourPlayerStyleScore

        expect(score?.score).deep.eq({ base: 2000 })
        expect(score?.honba).eq(0)
        expect(score?.fu).eq(30)
        expect(score?.yaku).eq(2)
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
            name: I18n.ja.fu[MenzenKafu.name],
            score: 10,
          },
        ])
        expect(score?.appliedYakuList).deep.eq([
          {
            isDoubleYakuman: false,
            isFu: false,
            isYakuman: false,
            name: I18n.ja.yaku[DoubleRiichi.name],
            score: 2,
            calculationBasedScore: 2,
          }
        ])

      })

      test('with furo', () => {
        const score = () => {
          const mahjong = new Mahjong(
            doubleRiichiExampleFormat,
            {
              hora: {
                pai: "2s",
                fromTsumo: false,
                fromRon: true,
                fromTankiMachi: false,
                fromRinshanPai: false,
              },

              jikaze: "2z",
              kaze: "1z",

              additionalSpecialYaku: {
                ...MahjongDefaultAdditionalSpecialYaku,
                withDoubleRiichi: true,
              }
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
