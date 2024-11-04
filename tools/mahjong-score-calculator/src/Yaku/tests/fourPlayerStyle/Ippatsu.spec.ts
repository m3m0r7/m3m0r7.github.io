import "../../../Utilities/Utilities";
import { describe, expect, test } from "vitest";
import { Mahjong } from "../../../Runtime/Mahjong";
import I18n from "../../../Lang/I18n";
import { PaiName } from "../../../@types/types";
import { Futei, MenzenKafu, Tsumo } from "../../../Fu";
import { Riichi } from "../../Riichi";
import { MahjongDefaultAdditionalSpecialYaku } from "../../../Runtime/MahjongDefaultOption";
import { Ippatsu } from "../../Ippatsu";
import { MenzenTsumo } from "../../MenzenTsumo";

const ippatsuRiichiExampleFormat: PaiName[] = [
  "1m",
  "2m",
  "3m",
  "5m",
  "6m",
  "7m",

  "3p",
  "4p",
  "5p",
  "6p",
  "7p",
  "8p",

  "2s",
  "2s",
];

describe("Ippatsu", () => {
  describe("fulfilled", () => {
    describe("parent", () => {
      test("tsumo", () => {
        const score = new Mahjong(ippatsuRiichiExampleFormat, {
          hora: {
            pai: "2s",
            fromTsumo: true,
            fromRon: false,

            fromRinshanPai: false,
          },

          // NOTE: Here is same of a mahjong parent
          jikaze: "1z",
          kaze: "1z",

          additionalSpecialYaku: {
            ...MahjongDefaultAdditionalSpecialYaku,
            withRiichi: true,
            withIppatsu: true,
          },
        }).score.fourPlayerStyleScore;

        expect(score?.score).deep.eq({ base: 5800, child: 2000 });
        expect(score?.honba).eq(0);
        expect(score?.fu).eq(30);
        expect(score?.yaku).eq(3);
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
        ]);
        expect(score?.appliedYakuList).deep.eq([
          {
            isDoubleYakuman: false,
            isFu: false,
            isYakuman: false,
            name: I18n.ja.yaku[Riichi.name],
            score: 1,
            calculationBasedScore: 1,
          },
          {
            isDoubleYakuman: false,
            isFu: false,
            isYakuman: false,
            name: I18n.ja.yaku[Ippatsu.name],
            score: 1,
            calculationBasedScore: 1,
          },
          {
            isDoubleYakuman: false,
            isFu: false,
            isYakuman: false,
            name: I18n.ja.yaku[MenzenTsumo.name],
            score: 1,
            calculationBasedScore: 1,
          },
        ]);
      });
      test("ron", () => {
        const score = new Mahjong(ippatsuRiichiExampleFormat, {
          hora: {
            pai: "2s",
            fromTsumo: false,
            fromRon: true,

            fromRinshanPai: false,
          },

          // NOTE: Here is same of a mahjong parent
          jikaze: "1z",
          kaze: "1z",

          additionalSpecialYaku: {
            ...MahjongDefaultAdditionalSpecialYaku,
            withRiichi: true,
            withIppatsu: true,
          },
        }).score.fourPlayerStyleScore;

        expect(score?.score).deep.eq({ base: 2900 });
        expect(score?.honba).eq(0);
        expect(score?.fu).eq(30);
        expect(score?.yaku).eq(2);
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
        ]);
        expect(score?.appliedYakuList).deep.eq([
          {
            isDoubleYakuman: false,
            isFu: false,
            isYakuman: false,
            name: I18n.ja.yaku[Riichi.name],
            score: 1,
            calculationBasedScore: 1,
          },
          {
            isDoubleYakuman: false,
            isFu: false,
            isYakuman: false,
            name: I18n.ja.yaku[Ippatsu.name],
            score: 1,
            calculationBasedScore: 1,
          },
        ]);
      });
    });

    describe("child", () => {
      test("tsumo", () => {
        const score = new Mahjong(ippatsuRiichiExampleFormat, {
          hora: {
            pai: "2s",
            fromTsumo: true,
            fromRon: false,

            fromRinshanPai: false,
          },

          jikaze: "2z",
          kaze: "1z",

          additionalSpecialYaku: {
            ...MahjongDefaultAdditionalSpecialYaku,
            withRiichi: true,
            withIppatsu: true,
          },
        }).score.fourPlayerStyleScore;

        expect(score?.score).deep.eq({ base: 3900, parent: 2000, child: 1000 });
        expect(score?.honba).eq(0);
        expect(score?.fu).eq(30);
        expect(score?.yaku).eq(3);
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
        ]);
        expect(score?.appliedYakuList).deep.eq([
          {
            isDoubleYakuman: false,
            isFu: false,
            isYakuman: false,
            name: I18n.ja.yaku[Riichi.name],
            score: 1,
            calculationBasedScore: 1,
          },
          {
            isDoubleYakuman: false,
            isFu: false,
            isYakuman: false,
            name: I18n.ja.yaku[Ippatsu.name],
            score: 1,
            calculationBasedScore: 1,
          },
          {
            isDoubleYakuman: false,
            isFu: false,
            isYakuman: false,
            name: I18n.ja.yaku[MenzenTsumo.name],
            score: 1,
            calculationBasedScore: 1,
          },
        ]);
      });
      test("ron", () => {
        const score = new Mahjong(ippatsuRiichiExampleFormat, {
          hora: {
            pai: "2s",
            fromTsumo: false,
            fromRon: true,

            fromRinshanPai: false,
          },

          jikaze: "2z",
          kaze: "1z",

          additionalSpecialYaku: {
            ...MahjongDefaultAdditionalSpecialYaku,
            withRiichi: true,
            withIppatsu: true,
          },
        }).score.fourPlayerStyleScore;

        expect(score?.score).deep.eq({ base: 2000 });
        expect(score?.honba).eq(0);
        expect(score?.fu).eq(30);
        expect(score?.yaku).eq(2);
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
        ]);
        expect(score?.appliedYakuList).deep.eq([
          {
            isDoubleYakuman: false,
            isFu: false,
            isYakuman: false,
            name: I18n.ja.yaku[Riichi.name],
            score: 1,
            calculationBasedScore: 1,
          },
          {
            isDoubleYakuman: false,
            isFu: false,
            isYakuman: false,
            name: I18n.ja.yaku[Ippatsu.name],
            score: 1,
            calculationBasedScore: 1,
          },
        ]);
      });

      test("with furo", () => {
        const score = () => {
          const mahjong = new Mahjong(ippatsuRiichiExampleFormat, {
            hora: {
              pai: "2s",
              fromTsumo: false,
              fromRon: true,

              fromRinshanPai: false,
            },

            jikaze: "2z",
            kaze: "1z",

            additionalSpecialYaku: {
              ...MahjongDefaultAdditionalSpecialYaku,
              withRiichi: true,
              withIppatsu: true,
            },
          });

          mahjong.updatePaiPairCollections((paiPairCollection) => {
            paiPairCollection.paiPairs.map((paiPair) => {
              paiPair.isFuro = true;
              return paiPair;
            });
            return paiPairCollection;
          });

          return mahjong.score.fourPlayerStyleScore;
        };

        expect(score).toThrow(
          "The mahjong scores are not available that reason for Yaku are not fulfilled, invalid format and so on",
        );
      });
    });
  });
});
