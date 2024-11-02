import '../../../Utilities/Utilities';
import { describe, expect, test } from "vitest";
import { Mahjong } from "../../../Runtime/Mahjong";
import I18n from "../../../Lang/I18n";
import { PaiName } from "../../../@types/types";
import { Ankou, Futei, MenzenKafu, Minkou, Tsumo } from "../../../Fu";
import { Hatsu } from "../../Hatsu";
import { DaiSanGen } from "../../DaiSanGen";

const daiSanGenExampleFormat: PaiName[] = [
  "1m", "2m", "3m",

  "5z", "5z", "5z",
  "6z", "6z", "6z",
  "7z", "7z", "7z",

  "2s", "2s",
]

describe('DaiSanGen', () => {
  describe('fulfilled', () => {
    describe('parent', () => {
      test('tsumo', () => {
        const score = new Mahjong(
          daiSanGenExampleFormat,
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
            name: I18n.ja.yaku[DaiSanGen.name],
          }
        ])

      })
      test('ron', () => {
        const score = new Mahjong(
          daiSanGenExampleFormat,
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
            name: I18n.ja.yaku[DaiSanGen.name],
          }
        ])


      })
    })

    describe('child', () => {
      test('tsumo', () => {
        const score = new Mahjong(
          daiSanGenExampleFormat,
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
            name: I18n.ja.yaku[DaiSanGen.name],
          }
        ])


      })
      test('ron', () => {
        const score = new Mahjong(
          daiSanGenExampleFormat,
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
            name: I18n.ja.yaku[DaiSanGen.name],
          }
        ])

      })


      test('with furo', () => {
        const mahjong = new Mahjong(
          daiSanGenExampleFormat,
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
          })

        mahjong.updatePaiPairCollections((paiPairCollection) => {
          paiPairCollection.paiPairs.map(paiPair => {
            paiPair.isFuro = true
            return paiPair
          })
          return paiPairCollection
        })

        const score = mahjong.score.fourPlayerStyleScore
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
            name: I18n.ja.yaku[DaiSanGen.name],
          }
        ])

      })
    })
  })
})
