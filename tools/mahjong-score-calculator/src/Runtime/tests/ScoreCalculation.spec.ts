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
  describe('invalid format', () => {
    test('over using pai', () => {
      const score = () => new Mahjong(
        ["1s", "1s", "1s", "1s", "1s"]
      ).score

      expect(score).toThrow('PaiTypes are invalid')
    })

    test('invalid format', () => {
      const score = () => new Mahjong(
        [
          "1m", "2m", "3m", "4m",
          "1p", "2p", "3p", "4p",
          "1s", "2s", "3s", "4s",
          "1z", "1z",
        ]
      ).score

      expect(score).toThrow('The mahjong scores are not available that reason for Yaku are not fulfilled, invalid format and so on')
    })

    test('invalid yaku', () => {
      const score = () => new Mahjong(
        [
          "1m", "2m", "3m",
          "2m", "3m", "4m",
          "1p", "2p", "3p",
          "2s", "3s", "4s",
          "1z", "1z",
        ]
      ).score

      expect(score).toThrow('The mahjong scores are not available that reason for Yaku are not fulfilled, invalid format and so on')
    })
  })

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

  describe('HaneMan', () => {
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
            "6p",
          ],
          // NOTE: Here is same of a mahjong parent
          jikaze: "1z",
          kaze: "1z",
        }).score

      expect(score?.score).deep.eq({ base: 18000, child: 6000 })
      expect(score?.honba).eq(0)
      expect(score?.fu).eq(30)
      expect(score?.yaku).eq(6)
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
          isDoubleYakuman: false,
          isFu: false,
          isYakuman: false,
          name: I18n.ja.yaku[Dora.name],
          score: 5,
          calculationBasedScore: 5,
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
            "6p",
          ],
          // NOTE: Here is same of a mahjong parent
          jikaze: "2z",
          kaze: "1z",
        }).score

      expect(score?.score).deep.eq({ base: 12000, parent: 6000, child: 3000 })
      expect(score?.honba).eq(0)
      expect(score?.fu).eq(30)
      expect(score?.yaku).eq(6)
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
          isDoubleYakuman: false,
          isFu: false,
          isYakuman: false,
          name: I18n.ja.yaku[Dora.name],
          score: 5,
          calculationBasedScore: 5,
        },
      ])

    })
  })

  describe('BaiMan', () => {
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
            "6p",
            "7p",
            "8p",
          ],
          // NOTE: Here is same of a mahjong parent
          jikaze: "1z",
          kaze: "1z",
        }).score

      expect(score?.score).deep.eq({ base: 24000, child: 8000 })
      expect(score?.honba).eq(0)
      expect(score?.fu).eq(30)
      expect(score?.yaku).eq(8)
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
          isDoubleYakuman: false,
          isFu: false,
          isYakuman: false,
          name: I18n.ja.yaku[Dora.name],
          score: 7,
          calculationBasedScore: 7,
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
            "6p",
            "7p",
            "8p",
          ],
          // NOTE: Here is same of a mahjong parent
          jikaze: "2z",
          kaze: "1z",
        }).score

      expect(score?.score).deep.eq({ base: 16000, parent: 8000, child: 4000 })
      expect(score?.honba).eq(0)
      expect(score?.fu).eq(30)
      expect(score?.yaku).eq(8)
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
          isDoubleYakuman: false,
          isFu: false,
          isYakuman: false,
          name: I18n.ja.yaku[Dora.name],
          score: 7,
          calculationBasedScore: 7,
        },
      ])

    })
  })

  describe('SanBaiMan', () => {
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
            "3m",
            "4m",
            "3p",
            "4p",
            "5p",
            "6p",
            "7p",
          ],
          // NOTE: Here is same of a mahjong parent
          jikaze: "1z",
          kaze: "1z",
        }).score

      expect(score?.score).deep.eq({ base: 36000, child: 12000 })
      expect(score?.honba).eq(0)
      expect(score?.fu).eq(30)
      expect(score?.yaku).eq(11)
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
          isDoubleYakuman: false,
          isFu: false,
          isYakuman: false,
          name: I18n.ja.yaku[Dora.name],
          score: 10,
          calculationBasedScore: 10,
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
            "3m",
            "4m",
            "3p",
            "4p",
            "5p",
            "6p",
            "7p",
          ],
          // NOTE: Here is same of a mahjong parent
          jikaze: "2z",
          kaze: "1z",
        }).score

      expect(score?.score).deep.eq({ base: 24000, parent: 12000, child: 6000 })
      expect(score?.honba).eq(0)
      expect(score?.fu).eq(30)
      expect(score?.yaku).eq(11)
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
          isDoubleYakuman: false,
          isFu: false,
          isYakuman: false,
          name: I18n.ja.yaku[Dora.name],
          score: 10,
          calculationBasedScore: 10,
        },
      ])

    })
  })
})
