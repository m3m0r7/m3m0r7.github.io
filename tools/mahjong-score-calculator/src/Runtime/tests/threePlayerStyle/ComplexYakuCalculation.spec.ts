import "../../../Utilities/Utilities";
import { describe, expect, test } from "vitest";
import { Mahjong } from "../../Mahjong";
import I18n from "../../../Lang/I18n";
import { Futei } from "../../../Fu";
import { Dora, IpeiKou, Tanyao } from "../../../Yaku";

describe("ComplexYakuCalculation for Three Player", () => {
  describe("complexes", () => {
    describe("tanyao and ipeikou and dora 2", () => {
      test("parent", () => {
        const score = new Mahjong(
          [
            "2s",
            "3s",
            "4s",
            "2s",
            "3s",
            "4s",

            "3p",
            "4p",
            "5p",
            "6p",
            "7p",
            "8p",

            "5s",
            "5s",
          ],
          {
            playStyle: 3,
            doraList: ["2s"],
          },
        ).calculator.value;

        expect(score?.score).deep.eq({ base: 11600 });
        expect(score?.fu).eq(30);
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
            isYakuman: false,
            isDoubleYakuman: false,
            isFu: false,
            name: I18n.ja.yaku[Tanyao.name],
            score: 1,
            calculationBasedScore: 1,
          },
          {
            isYakuman: false,
            isDoubleYakuman: false,
            isFu: false,
            name: I18n.ja.yaku[Dora.name],
            score: 2,
            calculationBasedScore: 2,
          },
          {
            isYakuman: false,
            isDoubleYakuman: false,
            isFu: false,
            name: I18n.ja.yaku[IpeiKou.name],
            score: 1,
            calculationBasedScore: 1,
          },
        ]);
      });

      test("child", () => {
        const score = new Mahjong(
          [
            "2s",
            "3s",
            "4s",
            "2s",
            "3s",
            "4s",

            "3p",
            "4p",
            "5p",
            "6p",
            "7p",
            "8p",

            "5s",
            "5s",
          ],
          {
            playStyle: 3,
            doraList: ["2s"],
            jikaze: "2z",
          },
        ).calculator.value;

        expect(score?.score).deep.eq({ base: 7700 });
        expect(score?.fu).eq(30);
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
            isYakuman: false,
            isDoubleYakuman: false,
            isFu: false,
            name: I18n.ja.yaku[Tanyao.name],
            score: 1,
            calculationBasedScore: 1,
          },
          {
            isYakuman: false,
            isDoubleYakuman: false,
            isFu: false,
            name: I18n.ja.yaku[Dora.name],
            score: 2,
            calculationBasedScore: 2,
          },
          {
            isYakuman: false,
            isDoubleYakuman: false,
            isFu: false,
            name: I18n.ja.yaku[IpeiKou.name],
            score: 1,
            calculationBasedScore: 1,
          },
        ]);
      });
    });
  });
});
