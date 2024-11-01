import '../../Utilities/Utilities';
import { describe, expect, test } from "vitest";
import { Mahjong } from "../Mahjong";
import I18n from "../../Lang/I18n";
import { PaiName } from "../../@types/types";
import { Futei, Tsumo } from "../../Fu";
import { Dora, Tanyao } from "../../Yaku";

const tanyaoExampleFormat: PaiName[] = [
  "2m", "3m", "4m",
  "5m", "6m", "7m",

  "3p", "4p", "5p",
  "6p", "7p", "8p",

  "2s", "2s",
];

describe('ScoreCalculation', () => {
  describe('Mangan', () => {
    test('parent', () => {
      const score = new Mahjong(
        tanyaoExampleFormat,
        {
          hora: {
            pai: "2s",
            fromTsumo: true,
            fromRon: false,
            fromTankiMachi: false,
            fromRinshanPai: false,
          },

          doraList: [
            "2s",
            "2m",
            "5p",
          ],
          // NOTE: Here is same of a mahjong parent
          jikaze: "1z",
          kaze: "1z",
        }).score

      expect(score?.score).deep.eq({ base: 12000, child: 4000 })
      expect(score?.honba).eq(0)
      expect(score?.fu).eq(30)
      expect(score?.yaku).eq(5)
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
          name: I18n.ja.yaku[Tanyao.name],
          score: 1,
          calculationBasedScore: 1,
        },
        {
          calculationBasedScore: 4,
          isDoubleYakuman: false,
          isFu: false,
          isYakuman: false,
          name: I18n.ja.yaku[Dora.name],
          score: 4,
        },
      ])

    })

    test('child', () => {
      const score = new Mahjong(
        tanyaoExampleFormat,
        {
          hora: {
            pai: "2s",
            fromTsumo: true,
            fromRon: false,
            fromTankiMachi: false,
            fromRinshanPai: false,
          },

          doraList: [
            "2s",
            "2m",
            "5p",
          ],
          // NOTE: Here is same of a mahjong parent
          jikaze: "2z",
          kaze: "1z",
        }).score

      expect(score?.score).deep.eq({ base: 8000, parent: 4000, child: 2000 })
      expect(score?.honba).eq(0)
      expect(score?.fu).eq(30)
      expect(score?.yaku).eq(5)
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
          name: I18n.ja.yaku[Tanyao.name],
          score: 1,
          calculationBasedScore: 1,
        },
        {
          calculationBasedScore: 4,
          isDoubleYakuman: false,
          isFu: false,
          isYakuman: false,
          name: I18n.ja.yaku[Dora.name],
          score: 4,
        },
      ])

    })
  })
})
