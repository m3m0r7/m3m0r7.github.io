import '../../../Utilities/Utilities';
import { describe, expect, test } from "vitest";
import { Mahjong } from "../../../Runtime/Mahjong";
import I18n from "../../../Lang/I18n";
import { PaiName } from "../../../@types/types";
import { Ankou, Futei, MenzenKafu, Minkou, Tsumo } from "../../../Fu";
import { Honitsu } from "../../Honitsu";
import { MenzenTsumo } from "../../MenzenTsumo";

const honitsuExampleFormat: PaiName[] = [

  "1m", "1m", "1m",
  "2m", "3m", "4m",
  "5m", "6m", "7m",
  "9m", "9m", "9m",

  "4z", "4z",
];

describe('Honitsu', () => {
  describe('fulfilled', () => {
    describe('parent', () => {
      test('tsumo', () => {
        const score = new Mahjong(
          honitsuExampleFormat,
          {
            hora: {
              pai: "4z",
              fromTsumo: true,
              fromRon: false,

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
            score: 16,
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
            name: I18n.ja.yaku[Honitsu.name],
            score: 3,
            calculationBasedScore: 3,
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
          honitsuExampleFormat,
          {
            hora: {
              pai: "4z",
              fromTsumo: false,
              fromRon: true,

              fromRinshanPai: false,
            },

            // NOTE: Here is same of a mahjong parent
            jikaze: "1z",
            kaze: "1z",
          }).score.fourPlayerStyleScore

        expect(score?.score).deep.eq({ base: 9600 })
        expect(score?.honba).eq(0)
        expect(score?.fu).eq(50)
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
            score: 16,
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
            name: I18n.ja.yaku[Honitsu.name],
            score: 3,
            calculationBasedScore: 3,
          }
        ])

      })
    })

    describe('child', () => {
      test('tsumo', () => {
        const score = new Mahjong(
          honitsuExampleFormat,
          {
            hora: {
              pai: "4z",
              fromTsumo: true,
              fromRon: false,

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
            score: 16,
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
            name: I18n.ja.yaku[Honitsu.name],
            score: 3,
            calculationBasedScore: 3,
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
          honitsuExampleFormat,
          {
            hora: {
              pai: "4z",
              fromTsumo: false,
              fromRon: true,

              fromRinshanPai: false,
            },

            jikaze: "2z",
            kaze: "1z",
          }).score.fourPlayerStyleScore

        expect(score?.score).deep.eq({ base: 6400 })
        expect(score?.honba).eq(0)
        expect(score?.fu).eq(50)
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
            score: 16,
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
            name: I18n.ja.yaku[Honitsu.name],
            score: 3,
            calculationBasedScore: 3,
          }
        ])

      })

      test('with furo', () => {
        const mahjong = new Mahjong(
          honitsuExampleFormat,
          {
            hora: {
              pai: "4z",
              fromTsumo: false,
              fromRon: true,

              fromRinshanPai: false,
            },

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

        const score = mahjong.score.fourPlayerStyleScore
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
            name: I18n.ja.fu[Minkou.name],
            score: 8,
          },
        ])
        expect(score?.appliedYakuList).deep.eq([
          {
            isDoubleYakuman: false,
            isFu: false,
            isYakuman: false,
            name: I18n.ja.yaku[Honitsu.name],
            score: 2,
            calculationBasedScore: 2,
          }
        ])
      })
    })
  })
})
