import "../../../Utilities/Utilities";
import { describe, expect, test } from "vitest";
import { Mahjong } from "../../../Runtime/Mahjong";
import I18n from "../../../Lang/I18n";
import { PaiName } from "../../../@types/types";
import { IkkiTsuukan } from "../../IkkiTsuukan";
import { Ankou, Futei, MenzenKafu, Tsumo } from "../../../Fu";
import { DaiSanGen } from "../../DaiSanGen";
import { MenzenTsumo } from "../../MenzenTsumo";

const ikkiTsuukanExampleFormat: PaiName[] = [
  "1m",
  "2m",
  "3m",
  "4m",
  "5m",
  "6m",
  "7m",
  "8m",
  "9m",
  "2p",
  "3p",
  "4p",

  "2s",
  "2s",
];

describe("IkkiTsuukan", () => {
  describe("fulfilled", () => {
    describe("parent", () => {
      test("tsumo", () => {
        const score = new Mahjong(ikkiTsuukanExampleFormat, {
          hora: {
            pai: "2s",
            fromTsumo: true,
            fromRon: false,

            fromRinshanPai: false,
          },

          // NOTE: Here is same of a mahjong parent
          jikaze: "1z",
          kaze: "1z",
        }).score.fourPlayerStyleScore;

        expect(score?.score).deep.eq({ base: 5800, child: 2000 });
        expect(score?.honba).eq(0);
        expect(score?.fu).eq(30);
        expect(score?.yaku).eq(3);
        expect(score?.appliedFuList).deep.eq([
          {
            isYakuman: false,
            isDoubleYakuman: false,
            isFu: true,
            name: I18n.ja.fu[Futei.name],
            score: 20,
          },
          {
            isYakuman: false,
            isDoubleYakuman: false,
            isFu: true,
            name: I18n.ja.fu[Tsumo.name],
            score: 2,
          },
        ]);
        expect(score?.appliedYakuList).deep.eq([
          {
            isDoubleYakuman: false,
            isFu: false,
            isYakuman: false,
            name: I18n.ja.yaku[IkkiTsuukan.name],
            score: 2,
            calculationBasedScore: 2,
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
        const score = new Mahjong(ikkiTsuukanExampleFormat, {
          hora: {
            pai: "2s",
            fromTsumo: false,
            fromRon: true,

            fromRinshanPai: false,
          },

          // NOTE: Here is same of a mahjong parent
          jikaze: "1z",
          kaze: "1z",
        }).score.fourPlayerStyleScore;

        expect(score?.score).deep.eq({ base: 2900 });
        expect(score?.honba).eq(0);
        expect(score?.fu).eq(30);
        expect(score?.yaku).eq(2);
        expect(score?.appliedFuList).deep.eq([
          {
            isYakuman: false,
            isDoubleYakuman: false,
            isFu: true,
            name: I18n.ja.fu[Futei.name],
            score: 20,
          },
          {
            isYakuman: false,
            isDoubleYakuman: false,
            isFu: true,
            name: I18n.ja.fu[MenzenKafu.name],
            score: 10,
          },
        ]);
        expect(score?.appliedYakuList).deep.eq([
          {
            isDoubleYakuman: false,
            isFu: false,
            isYakuman: false,
            name: I18n.ja.yaku[IkkiTsuukan.name],
            score: 2,
            calculationBasedScore: 2,
          },
        ]);
      });
    });

    describe("child", () => {
      test("tsumo", () => {
        const score = new Mahjong(ikkiTsuukanExampleFormat, {
          hora: {
            pai: "2s",
            fromTsumo: true,
            fromRon: false,

            fromRinshanPai: false,
          },

          jikaze: "2z",
          kaze: "1z",
        }).score.fourPlayerStyleScore;

        expect(score?.score).deep.eq({ base: 3900, parent: 2000, child: 1000 });
        expect(score?.honba).eq(0);
        expect(score?.fu).eq(30);
        expect(score?.yaku).eq(3);
        expect(score?.appliedFuList).deep.eq([
          {
            isYakuman: false,
            isDoubleYakuman: false,
            isFu: true,
            name: I18n.ja.fu[Futei.name],
            score: 20,
          },
          {
            isYakuman: false,
            isDoubleYakuman: false,
            isFu: true,
            name: I18n.ja.fu[Tsumo.name],
            score: 2,
          },
        ]);
        expect(score?.appliedYakuList).deep.eq([
          {
            isDoubleYakuman: false,
            isFu: false,
            isYakuman: false,
            name: I18n.ja.yaku[IkkiTsuukan.name],
            score: 2,
            calculationBasedScore: 2,
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
        const score = new Mahjong(ikkiTsuukanExampleFormat, {
          hora: {
            pai: "2s",
            fromTsumo: false,
            fromRon: true,

            fromRinshanPai: false,
          },

          jikaze: "2z",
          kaze: "1z",
        }).score.fourPlayerStyleScore;

        expect(score?.score).deep.eq({ base: 2000 });
        expect(score?.honba).eq(0);
        expect(score?.fu).eq(30);
        expect(score?.yaku).eq(2);
        expect(score?.appliedFuList).deep.eq([
          {
            isYakuman: false,
            isDoubleYakuman: false,
            isFu: true,
            name: I18n.ja.fu[Futei.name],
            score: 20,
          },
          {
            isYakuman: false,
            isDoubleYakuman: false,
            isFu: true,
            name: I18n.ja.fu[MenzenKafu.name],
            score: 10,
          },
        ]);
        expect(score?.appliedYakuList).deep.eq([
          {
            isDoubleYakuman: false,
            isFu: false,
            isYakuman: false,
            name: I18n.ja.yaku[IkkiTsuukan.name],
            score: 2,
            calculationBasedScore: 2,
          },
        ]);
      });

      test("with furo", () => {
        const mahjong = new Mahjong(
          [
            "1mf",
            "2m",
            "3m",
            "4m",
            "5m",
            "6m",
            "7m",
            "8m",
            "9m",
            "2p",
            "3p",
            "4p",

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

            jikaze: "2z",
            kaze: "1z",
          },
        );

        const score = mahjong.score.fourPlayerStyleScore;
        expect(score?.score).deep.eq({ base: 1000 });
        expect(score?.honba).eq(0);
        expect(score?.fu).eq(30);
        expect(score?.yaku).eq(1);
        expect(score?.appliedFuList).deep.eq([
          {
            isYakuman: false,
            isDoubleYakuman: false,
            isFu: true,
            name: I18n.ja.fu[Futei.name],
            score: 20,
          },
        ]);
        expect(score?.appliedYakuList).deep.eq([
          {
            isDoubleYakuman: false,
            isFu: false,
            isYakuman: false,
            name: I18n.ja.yaku[IkkiTsuukan.name],
            score: 1,
            calculationBasedScore: 1,
          },
        ]);
      });
    });
  });
});
