import '../../../Utilities/Utilities';
import { describe, expect, test } from "vitest";
import { Mahjong } from "../../../Runtime/Mahjong";
import I18n from "../../../Lang/I18n";
import { PaiName } from "../../../@types/types";
import { MahjongDefaultAdditionalSpecialYaku } from "../../../Runtime/MahjongDefaultOption";
import { Tenho } from "../../Tenho";

const hakuExampleFormat: PaiName[] = [
  "1m", "2m", "3m",
  "5m", "6m", "7m",

  "3p", "4p", "5p",
  "5z", "5z", "5z",

  "2s", "2s",
]

describe('Tenho', () => {
  describe('fulfilled', () => {
    describe('parent', () => {
      test('tsumo', () => {
        const score = new Mahjong(
          hakuExampleFormat,
          {
            hora: {
              pai: "2s",
              fromTsumo: true,
              fromRon: false,
              fromTankiMachi: false,
              fromRinshanPai: false,
            },

            additionalSpecialYaku: {
              ...MahjongDefaultAdditionalSpecialYaku,
              withTenho: true,
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
            name: I18n.ja.yaku[Tenho.name],
          }
        ])

      })
      test('ron', () => {
        const score = new Mahjong(
          hakuExampleFormat,
          {
            hora: {
              pai: "2s",
              fromTsumo: false,
              fromRon: true,
              fromTankiMachi: false,
              fromRinshanPai: false,
            },

            additionalSpecialYaku: {
              ...MahjongDefaultAdditionalSpecialYaku,
              withTenho: true,
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
            name: I18n.ja.yaku[Tenho.name],
          }
        ])

      })
    })

    describe('child', () => {
      test('tsumo', () => {
        const score = new Mahjong(
          hakuExampleFormat,
          {
            hora: {
              pai: "2s",
              fromTsumo: true,
              fromRon: false,
              fromTankiMachi: false,
              fromRinshanPai: false,
            },

            additionalSpecialYaku: {
              ...MahjongDefaultAdditionalSpecialYaku,
              withTenho: true,
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
            name: I18n.ja.yaku[Tenho.name],
          }
        ])

      })
      test('ron', () => {
        const score = new Mahjong(
          hakuExampleFormat,
          {
            hora: {
              pai: "2s",
              fromTsumo: false,
              fromRon: true,
              fromTankiMachi: false,
              fromRinshanPai: false,
            },

            additionalSpecialYaku: {
              ...MahjongDefaultAdditionalSpecialYaku,
              withTenho: true,
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
            name: I18n.ja.yaku[Tenho.name],
          }
        ])
      })
    })
  })
})
