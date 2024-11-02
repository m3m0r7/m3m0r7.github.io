import '../../../Utilities/Utilities';
import { describe, expect, test } from "vitest";
import { Mahjong } from "../../../Runtime/Mahjong";
import I18n from "../../../Lang/I18n";
import { PaiName } from "../../../@types/types";
import { ChinRoutou } from "../../ChinRoutou";
import { Futei, Minkou, Tsumo } from "../../../Fu";

const chinRoutouExampleFormat: PaiName[] = [
  "1mf", "1m", "1m",
  "9mf", "9m", "9m",
  "1pf", "1p", "1p",
  "9pf", "9p", "9p",

  "1s", "1s",
]

describe('ChinRoutou', () => {
  describe('fulfilled', () => {
    describe('parent', () => {
      test('tsumo', () => {
        const score = new Mahjong(
          chinRoutouExampleFormat,
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

        expect(score?.score).deep.eq({ base: 48000, child: 16000 })
        expect(score?.honba).eq(0)
        expect(score?.fu).eq(null)
        expect(score?.yaku).eq('FULL')
        expect(score?.appliedFuList).deep.eq([])
        expect(score?.appliedYakuList).deep.eq([
          {
            isDoubleYakuman: false,
            isFu: false,
            isYakuman: true,
            name: I18n.ja.yaku[ChinRoutou.name],
          },
        ])

      })
      test('ron', () => {
        const score = new Mahjong(
          chinRoutouExampleFormat,
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

        expect(score?.score).deep.eq({ base: 48000 })
        expect(score?.honba).eq(0)
        expect(score?.fu).eq(null)
        expect(score?.yaku).eq('FULL')
        expect(score?.appliedFuList).deep.eq([])
        expect(score?.appliedYakuList).deep.eq([
          {
            isDoubleYakuman: false,
            isFu: false,
            isYakuman: true,
            name: I18n.ja.yaku[ChinRoutou.name],
          },
        ])
      })
    })

    describe('child', () => {
      test('tsumo', () => {
        const score = new Mahjong(
          chinRoutouExampleFormat,
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

        expect(score?.score).deep.eq({ base: 32000, parent: 16000, child: 8000 })
        expect(score?.honba).eq(0)
        expect(score?.fu).eq(null)
        expect(score?.yaku).eq('FULL')
        expect(score?.appliedFuList).deep.eq([])
        expect(score?.appliedYakuList).deep.eq([
          {
            isDoubleYakuman: false,
            isFu: false,
            isYakuman: true,
            name: I18n.ja.yaku[ChinRoutou.name],
          },
        ])

      })
      test('ron', () => {
        const score = new Mahjong(
          chinRoutouExampleFormat,
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

        expect(score?.score).deep.eq({ base: 32000 })
        expect(score?.honba).eq(0)
        expect(score?.fu).eq(null)
        expect(score?.yaku).eq('FULL')
        expect(score?.appliedFuList).deep.eq([])
        expect(score?.appliedYakuList).deep.eq([
          {
            isDoubleYakuman: false,
            isFu: false,
            isYakuman: true,
            name: I18n.ja.yaku[ChinRoutou.name],
          },
        ])
      })
    })
  })
})
