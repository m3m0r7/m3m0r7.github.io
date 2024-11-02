import '../../../Utilities/Utilities';
import { describe, expect, test } from "vitest";
import { Mahjong } from "../../../Runtime/Mahjong";
import I18n from "../../../Lang/I18n";
import { PaiName } from "../../../@types/types";
import { HonRoutou } from "../../HonRoutou";
import { Futei, Minkou, Tsumo } from "../../../Fu";
import { ToiToi } from "../../ToiToi";

const honRoutouExampleFormat: PaiName[] = [
  "1mf", "1m", "1m",
  "9mf", "9m", "9m",
  "1pf", "1p", "1p",
  "9pf", "9p", "9p",

  "4z", "4z",
]

describe('HonRoutou and ToiToi', () => {
  describe('fulfilled', () => {
    describe('parent', () => {
      test('tsumo', () => {
        const score = new Mahjong(
          honRoutouExampleFormat,
          {
            hora: {
              pai: "1p",
              fromTsumo: true,
              fromRon: false,
              fromTankiMachi: false,
              fromRinshanPai: false,
            },

            // NOTE: Here is same of a mahjong parent
            jikaze: "1z",
            kaze: "1z",
          }).score.fourPlayerStyleScore

        expect(score?.score).deep.eq({ base: 12000, child: 4000 })
        expect(score?.honba).eq(0)
        expect(score?.fu).eq(40)
        expect(score?.yaku).eq(4)
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
            name: I18n.ja.fu[Minkou.name],
            score: 16
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
            name: I18n.ja.yaku[HonRoutou.name],
            score: 2,
            calculationBasedScore: 2,
          },
          {
            isDoubleYakuman: false,
            isFu: false,
            isYakuman: false,
            name: I18n.ja.yaku[ToiToi.name],
            score: 2,
            calculationBasedScore: 2,
          }
        ])

      })
      test('ron', () => {
        const score = new Mahjong(
          honRoutouExampleFormat,
          {
            hora: {
              pai: "1p",
              fromTsumo: false,
              fromRon: true,
              fromTankiMachi: false,
              fromRinshanPai: false,
            },

            // NOTE: Here is same of a mahjong parent
            jikaze: "1z",
            kaze: "1z",
          }).score.fourPlayerStyleScore

        expect(score?.score).deep.eq({ base: 12000 })
        expect(score?.honba).eq(0)
        expect(score?.fu).eq(40)
        expect(score?.yaku).eq(4)
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
            name: I18n.ja.fu[Minkou.name],
            score: 16
          },
        ])
        expect(score?.appliedYakuList).deep.eq([
          {
            isDoubleYakuman: false,
            isFu: false,
            isYakuman: false,
            name: I18n.ja.yaku[HonRoutou.name],
            score: 2,
            calculationBasedScore: 2,
          },
          {
            isDoubleYakuman: false,
            isFu: false,
            isYakuman: false,
            name: I18n.ja.yaku[ToiToi.name],
            score: 2,
            calculationBasedScore: 2,
          }
        ])
      })
    })

    describe('child', () => {
      test('tsumo', () => {
        const score = new Mahjong(
          honRoutouExampleFormat,
          {
            hora: {
              pai: "1p",
              fromTsumo: true,
              fromRon: false,
              fromTankiMachi: false,
              fromRinshanPai: false,
            },

            jikaze: "2z",
            kaze: "1z",
          }).score.fourPlayerStyleScore

        expect(score?.score).deep.eq({ base: 8000, parent: 4000, child: 2000 })
        expect(score?.honba).eq(0)
        expect(score?.fu).eq(40)
        expect(score?.yaku).eq(4)
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
            name: I18n.ja.fu[Minkou.name],
            score: 16
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
            name: I18n.ja.yaku[HonRoutou.name],
            score: 2,
            calculationBasedScore: 2,
          },
          {
            isDoubleYakuman: false,
            isFu: false,
            isYakuman: false,
            name: I18n.ja.yaku[ToiToi.name],
            score: 2,
            calculationBasedScore: 2,
          }
        ])


      })
      test('ron', () => {
        const score = new Mahjong(
          honRoutouExampleFormat,
          {
            hora: {
              pai: "1p",
              fromTsumo: false,
              fromRon: true,
              fromTankiMachi: false,
              fromRinshanPai: false,
            },

            jikaze: "2z",
            kaze: "1z",
          }).score.fourPlayerStyleScore

        expect(score?.score).deep.eq({ base: 8000 })
        expect(score?.honba).eq(0)
        expect(score?.fu).eq(40)
        expect(score?.yaku).eq(4)
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
            name: I18n.ja.fu[Minkou.name],
            score: 16
          },
        ])
        expect(score?.appliedYakuList).deep.eq([
          {
            isDoubleYakuman: false,
            isFu: false,
            isYakuman: false,
            name: I18n.ja.yaku[HonRoutou.name],
            score: 2,
            calculationBasedScore: 2,
          },
          {
            isDoubleYakuman: false,
            isFu: false,
            isYakuman: false,
            name: I18n.ja.yaku[ToiToi.name],
            score: 2,
            calculationBasedScore: 2,
          }
        ])
      })
    })
  })
})
