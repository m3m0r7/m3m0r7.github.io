import "../../../Utilities/Utilities";
import { describe, expect, test } from "vitest";
import { Mahjong } from "../../../Runtime/Mahjong";
import I18n from "../../../Lang/I18n";
import { PaiName } from "../../../@types/types";
import { Ankou, Futei, MenzenKafu, Minkou, Tsumo } from "../../../Fu";
import { MenFon } from "../../MenFon";
import { MahjongDefaultAdditionalSpecialYaku } from "../../../Runtime/MahjongDefaultOption";
import { Ippatsu } from "../../Ippatsu";
import { MenzenTsumo } from "../../MenzenTsumo";

const menFonExampleFormat: PaiName[] = [
  "1m",
  "2m",
  "3m",
  "5m",
  "6m",
  "7m",

  "3p",
  "4p",
  "5p",
  "2z",
  "2z",
  "2z",

  "2s",
  "2s",
];

describe("MenFon", () => {
  describe("fulfilled", () => {
    describe("parent", () => {
      test("tsumo", () => {
        const score = new Mahjong(menFonExampleFormat, {
          hora: {
            pai: "2s",
            fromTsumo: true,
            fromRon: false,

            fromRinshanPai: false,
          },

          // NOTE: Here is same of a mahjong parent
          jikaze: "2z",
          kaze: "1z",
        }).score.fourPlayerStyleScore;

        expect(score?.score).deep.eq({ base: 2000, parent: 1000, child: 500 });
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
            name: I18n.ja.fu[Ankou.name],
            score: 8,
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
            name: I18n.ja.yaku[MenFon.name],
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
        const score = new Mahjong(menFonExampleFormat, {
          hora: {
            pai: "2s",
            fromTsumo: false,
            fromRon: true,

            fromRinshanPai: false,
          },

          // NOTE: Here is same of a mahjong parent
          jikaze: "2z",
          kaze: "1z",
        }).score.fourPlayerStyleScore;

        expect(score?.score).deep.eq({ base: 1300 });
        expect(score?.honba).eq(0);
        expect(score?.fu).eq(40);
        expect(score?.yaku).eq(1);
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
            score: 8,
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
            name: I18n.ja.yaku[MenFon.name],
            score: 1,
            calculationBasedScore: 1,
          },
        ]);
      });
    });

    describe("child", () => {
      test("tsumo", () => {
        const score = new Mahjong(menFonExampleFormat, {
          hora: {
            pai: "2s",
            fromTsumo: true,
            fromRon: false,

            fromRinshanPai: false,
          },

          jikaze: "2z",
          kaze: "1z",
        }).score.fourPlayerStyleScore;

        expect(score?.score).deep.eq({ base: 2000, parent: 1000, child: 500 });
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
            name: I18n.ja.fu[Ankou.name],
            score: 8,
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
            name: I18n.ja.yaku[MenFon.name],
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
        const score = new Mahjong(menFonExampleFormat, {
          hora: {
            pai: "2s",
            fromTsumo: false,
            fromRon: true,

            fromRinshanPai: false,
          },

          jikaze: "2z",
          kaze: "1z",
        }).score.fourPlayerStyleScore;

        expect(score?.score).deep.eq({ base: 1300 });
        expect(score?.honba).eq(0);
        expect(score?.fu).eq(40);
        expect(score?.yaku).eq(1);
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
            score: 8,
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
            name: I18n.ja.yaku[MenFon.name],
            score: 1,
            calculationBasedScore: 1,
          },
        ]);
      });

      test("with furo", () => {
        const mahjong = new Mahjong(menFonExampleFormat, {
          hora: {
            pai: "2s",
            fromTsumo: false,
            fromRon: true,

            fromRinshanPai: false,
          },

          jikaze: "2z",
          kaze: "1z",
        });

        mahjong.updatePaiPairCollections((paiPairCollection) => {
          paiPairCollection.paiPairs.map((paiPair) => {
            paiPair.isFuro = true;
            return paiPair;
          });
          return paiPairCollection;
        });

        const score = mahjong.score.fourPlayerStyleScore;

        expect(score?.score).deep.eq({ base: 1000 });
        expect(score?.honba).eq(0);
        expect(score?.fu).eq(30);
        expect(score?.yaku).eq(1);
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
            score: 4,
          },
        ]);
        expect(score?.appliedYakuList).deep.eq([
          {
            isDoubleYakuman: false,
            isFu: false,
            isYakuman: false,
            name: I18n.ja.yaku[MenFon.name],
            score: 1,
            calculationBasedScore: 1,
          },
        ]);
      });

      test("yaku is not available", () => {
        const score = () =>
          new Mahjong(
            [
              "1m",
              "2m",
              "3m",
              "5m",
              "6m",
              "7m",

              "3p",
              "4p",
              "5p",
              "2z",
              "2z",
              "2z",

              "2s",
              "2s",
            ],
            {
              hora: {
                pai: "2s",
                fromTsumo: false,
                fromRon: true,

                fromRinshanPai: false,
              },

              jikaze: "1z",
              kaze: "1z",
            },
          ).score.fourPlayerStyleScore;

        expect(score).toThrow(
          "The mahjong scores are not available that reason for Yaku are not fulfilled, invalid format and so on",
        );
      });
    });
  });
});
