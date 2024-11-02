import '../../../Utilities/Utilities';
import { describe, expect, test } from "vitest";
import { Mahjong } from "../../../Runtime/Mahjong";
import I18n from "../../../Lang/I18n";
import { PaiName } from "../../../@types/types";
import { RyanPeiKou } from "../../RyanPeiKou";
import { Ankou, Futei, MenzenKafu, Tsumo } from "../../../Fu";

const ryanPeiKouExampleFormat: PaiName[] = [
  "1m", "1m", "1m",
  "2m", "2m", "2m",
  "3m", "3m", "3m",
  "2p", "3p", "4p",

  "2s", "2s",
]

describe('RyanPeiKou', () => {
  describe('fulfilled', () => {
    describe('parent', () => {
      test('tsumo', () => {
        const score = new Mahjong(
          ryanPeiKouExampleFormat,
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
          }).score.fourPlayerStyleScore

        expect(score?.score).deep.eq({ base: 5800, child: 2000 })
        expect(score?.fu).eq(30)
        expect(score?.yaku).eq(3)
        expect(score?.appliedFuList).deep.eq([
          {
            isYakuman: false,
            isDoubleYakuman: false,
            isFu: true,
            name: I18n.ja.fu[Futei.name],
            score: 20
          },
          {
            isYakuman: false,
            isDoubleYakuman: false,
            isFu: true,
            name: I18n.ja.fu[Tsumo.name],
            score: 2
          }
        ])
        expect(score?.appliedYakuList).deep.eq([
          {
            isDoubleYakuman: false,
            isFu: false,
            isYakuman: false,
            name: I18n.ja.yaku[RyanPeiKou.name],
            score: 3,
            calculationBasedScore: 3,
          }
        ])

      })
      test('ron', () => {
        const score = new Mahjong(
          ryanPeiKouExampleFormat,
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
          }).score.fourPlayerStyleScore

        expect(score?.score).deep.eq({ base: 5800 })
        expect(score?.honba).eq(0)
        expect(score?.fu).eq(30)
        expect(score?.yaku).eq(3)
        expect(score?.appliedFuList).deep.eq([
          {
            isYakuman: false,
            isDoubleYakuman: false,
            isFu: true,
            name: I18n.ja.fu[Futei.name],
            score: 20
          },
          {
            isYakuman: false,
            isDoubleYakuman: false,
            isFu: true,
            name: I18n.ja.fu[MenzenKafu.name],
            score: 10
          }
        ])
        expect(score?.appliedYakuList).deep.eq([
          {
            isDoubleYakuman: false,
            isFu: false,
            isYakuman: false,
            name: I18n.ja.yaku[RyanPeiKou.name],
            score: 3,
            calculationBasedScore: 3,
          }
        ])
      })
    })

    describe('child', () => {
      test('tsumo', () => {
        const score = new Mahjong(
          ryanPeiKouExampleFormat,
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
          }).score.fourPlayerStyleScore

        expect(score?.score).deep.eq({ base: 3900, parent: 2000, child: 1000 })
        expect(score?.honba).eq(0)
        expect(score?.fu).eq(30)
        expect(score?.yaku).eq(3)
        expect(score?.appliedFuList).deep.eq([
          {
            isYakuman: false,
            isDoubleYakuman: false,
            isFu: true,
            name: I18n.ja.fu[Futei.name],
            score: 20
          },
          {
            isYakuman: false,
            isDoubleYakuman: false,
            isFu: true,
            name: I18n.ja.fu[Tsumo.name],
            score: 2
          }
        ])
        expect(score?.appliedYakuList).deep.eq([
          {
            isDoubleYakuman: false,
            isFu: false,
            isYakuman: false,
            name: I18n.ja.yaku[RyanPeiKou.name],
            score: 3,
            calculationBasedScore: 3,
          }
        ])

      })
      test('ron', () => {
        const score = new Mahjong(
          ryanPeiKouExampleFormat,
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
          }).score.fourPlayerStyleScore

        expect(score?.score).deep.eq({ base: 3900 })
        expect(score?.honba).eq(0)
        expect(score?.fu).eq(30)
        expect(score?.yaku).eq(3)
        expect(score?.appliedFuList).deep.eq([
          {
            isYakuman: false,
            isDoubleYakuman: false,
            isFu: true,
            name: I18n.ja.fu[Futei.name],
            score: 20
          },
          {
            isYakuman: false,
            isDoubleYakuman: false,
            isFu: true,
            name: I18n.ja.fu[MenzenKafu.name],
            score: 10
          }
        ])
        expect(score?.appliedYakuList).deep.eq([
          {
            isDoubleYakuman: false,
            isFu: false,
            isYakuman: false,
            name: I18n.ja.yaku[RyanPeiKou.name],
            score: 3,
            calculationBasedScore: 3,
          }
        ])
      })
    })
  })
})
