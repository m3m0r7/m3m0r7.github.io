import '../../../Utilities/Utilities';
import { describe, expect, test } from "vitest";
import { Mahjong } from "../../../Runtime/Mahjong";
import { PaiGenerator } from "../../../Utilities/PaiGenerator";
import I18n from "../../../Lang/I18n";
import { PaiName } from "../../../@types/types";
import { ChiiToitsu } from "../../ChiiToitsu";
import { Futei, MenzenKafu } from "../../../Fu";

const chiiToitsuExampleFormat: PaiName[] = [
  "3m", "3m",
  "5m", "5m",

  "1p", "1p",
  "3p", "3p",
  "5p", "5p",

  "1s", "1s",
];

describe('ChiiToitsu', () => {
  describe('fulfilled', () => {
    describe('parent', () => {
      test('tsumo', () => {
        const score = new Mahjong(
          chiiToitsuExampleFormat,
          {
            hora: {
              pai: "1s",
              fromTsumo: true,
              fromRon: false,
              fromTankiMachi: false,
              fromRinshanPai: false,
            },

            // NOTE: Here is same of a mahjong parent
            jikaze: "1z",
            kaze: "1z",
          }).score.fourPlayerStyleScore

        expect(score?.score).deep.eq({ base: 2400, child: 800 })
        expect(score?.honba).eq(0)
        expect(score?.fu).eq(25)
        expect(score?.yaku).eq(2)

        expect(score?.appliedFuList).deep.eq([
          {
            isDoubleYakuman: false,
            isFu: true,
            isYakuman: false,
            name: I18n.ja.fu[Futei.name],
            score: 25,
          },
        ])
        expect(score?.appliedYakuList).deep.eq([
          {
            isDoubleYakuman: false,
            isFu: false,
            isYakuman: false,
            name: I18n.ja.yaku[ChiiToitsu.name],
            score: 2,
            calculationBasedScore: 2,
          }
        ])

      })
      test('ron', () => {
        const score = new Mahjong(
          chiiToitsuExampleFormat,
          {
            hora: {
              pai: "1s",
              fromTsumo: false,
              fromRon: true,
              fromTankiMachi: false,
              fromRinshanPai: false,
            },

            // NOTE: Here is same of a mahjong parent
            jikaze: "1z",
            kaze: "1z",
          }).score.fourPlayerStyleScore

        expect(score?.score).deep.eq({ base: 2400 })
        expect(score?.honba).eq(0)
        expect(score?.fu).eq(25)
        expect(score?.yaku).eq(2)

        expect(score?.appliedFuList).deep.eq([
          {
            isDoubleYakuman: false,
            isFu: true,
            isYakuman: false,
            name: I18n.ja.fu[Futei.name],
            score: 25,
          },
        ])
        expect(score?.appliedYakuList).deep.eq([
          {
            isDoubleYakuman: false,
            isFu: false,
            isYakuman: false,
            name: I18n.ja.yaku[ChiiToitsu.name],
            score: 2,
            calculationBasedScore: 2,
          }
        ])

      })
    })

    describe('child', () => {
      test('tsumo', () => {
        const score = new Mahjong(
          chiiToitsuExampleFormat,
          {
            hora: {
              pai: "1s",
              fromTsumo: true,
              fromRon: false,
              fromTankiMachi: false,
              fromRinshanPai: false,
            },

            jikaze: "2z",
            kaze: "1z",
          }).score.fourPlayerStyleScore

        expect(score?.score).deep.eq({ base: 1600, parent: 800, child: 400 })
        expect(score?.honba).eq(0)
        expect(score?.fu).eq(25)
        expect(score?.yaku).eq(2)

        expect(score?.appliedFuList).deep.eq([
          {
            isDoubleYakuman: false,
            isFu: true,
            isYakuman: false,
            name: I18n.ja.fu[Futei.name],
            score: 25,
          },
        ])
        expect(score?.appliedYakuList).deep.eq([
          {
            isDoubleYakuman: false,
            isFu: false,
            isYakuman: false,
            name: I18n.ja.yaku[ChiiToitsu.name],
            score: 2,
            calculationBasedScore: 2,
          }
        ])

      })
      test('ron', () => {
        const score = new Mahjong(
          chiiToitsuExampleFormat,
          {
            hora: {
              pai: "1s",
              fromTsumo: false,
              fromRon: true,
              fromTankiMachi: false,
              fromRinshanPai: false,
            },

            jikaze: "2z",
            kaze: "1z",
          }).score.fourPlayerStyleScore

        expect(score?.score).deep.eq({ base: 1600 })
        expect(score?.honba).eq(0)
        expect(score?.fu).eq(25)
        expect(score?.yaku).eq(2)
        expect(score?.appliedFuList).deep.eq([
          {
            isDoubleYakuman: false,
            isFu: true,
            isYakuman: false,
            name: I18n.ja.fu[Futei.name],
            score: 25,
          },
        ])
        expect(score?.appliedYakuList).deep.eq([
          {
            isDoubleYakuman: false,
            isFu: false,
            isYakuman: false,
            name: I18n.ja.yaku[ChiiToitsu.name],
            score: 2,
            calculationBasedScore: 2,
          }
        ])

      })
    })
  })
})
