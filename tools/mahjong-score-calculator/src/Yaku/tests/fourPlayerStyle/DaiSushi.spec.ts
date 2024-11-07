import "../../../Utilities/Utilities";
import { describe, expect, test } from "vitest";
import { Mahjong } from "../../../Runtime/Mahjong";
import I18n from "../../../Lang/I18n";
import { PaiName } from "../../../@types/types";
import { DaiSushi } from "../../DaiSushi";

const daiSushiExampleFormat: PaiName[] = [
  "1z",
  "1z",
  "1z",
  "2z",
  "2z",
  "2z",
  "3z",
  "3z",
  "3z",

  "4z",
  "4z",
  "4z",

  "1m",
  "1m",
];

describe("DaiSushi", () => {
  describe("fulfilled", () => {
    describe("parent", () => {
      test("tsumo", () => {
        const score = new Mahjong(daiSushiExampleFormat, {
          hora: {
            pai: "4z",
            fromTsumo: true,
            fromRon: false,

            fromRinshanPai: false,
          },

          // NOTE: Here is same of a mahjong parent
          jikaze: "1z",
          kaze: "1z",
        }).calculator.value;

        expect(score?.score).deep.eq({ base: 96000, child: 32000 });
        expect(score?.honba).eq(0);
        expect(score?.fu).eq(null);
        expect(score?.yaku).eq("DOUBLE_FULL");
        expect(score?.appliedFuList).deep.eq([]);
        expect(score?.appliedYakuList).deep.eq([
          {
            isDoubleYakuman: true,
            isFu: false,
            isYakuman: false,
            name: I18n.ja.yaku[DaiSushi.name],
          },
        ]);
      });
      test("ron", () => {
        const score = new Mahjong(daiSushiExampleFormat, {
          hora: {
            pai: "4z",
            fromTsumo: false,
            fromRon: true,

            fromRinshanPai: false,
          },

          // NOTE: Here is same of a mahjong parent
          jikaze: "1z",
          kaze: "1z",
        }).calculator.value;

        expect(score?.score).deep.eq({ base: 96000 });
        expect(score?.honba).eq(0);
        expect(score?.fu).eq(null);
        expect(score?.yaku).eq("DOUBLE_FULL");
        expect(score?.appliedFuList).deep.eq([]);
        expect(score?.appliedYakuList).deep.eq([
          {
            isDoubleYakuman: true,
            isFu: false,
            isYakuman: false,
            name: I18n.ja.yaku[DaiSushi.name],
          },
        ]);
      });
    });

    describe("child", () => {
      test("tsumo", () => {
        const score = new Mahjong(daiSushiExampleFormat, {
          hora: {
            pai: "4z",
            fromTsumo: true,
            fromRon: false,

            fromRinshanPai: false,
          },

          jikaze: "2z",
          kaze: "1z",
        }).calculator.value;

        expect(score?.score).deep.eq({
          base: 64000,
          parent: 32000,
          child: 16000,
        });
        expect(score?.honba).eq(0);
        expect(score?.fu).eq(null);
        expect(score?.yaku).eq("DOUBLE_FULL");
        expect(score?.appliedFuList).deep.eq([]);
        expect(score?.appliedYakuList).deep.eq([
          {
            isDoubleYakuman: true,
            isFu: false,
            isYakuman: false,
            name: I18n.ja.yaku[DaiSushi.name],
          },
        ]);
      });
      test("ron", () => {
        const score = new Mahjong(daiSushiExampleFormat, {
          hora: {
            pai: "4z",
            fromTsumo: false,
            fromRon: true,

            fromRinshanPai: false,
          },

          jikaze: "2z",
          kaze: "1z",
        }).calculator.value;

        expect(score?.score).deep.eq({ base: 64000 });
        expect(score?.honba).eq(0);
        expect(score?.fu).eq(null);
        expect(score?.yaku).eq("DOUBLE_FULL");
        expect(score?.appliedFuList).deep.eq([]);
        expect(score?.appliedYakuList).deep.eq([
          {
            isDoubleYakuman: true,
            isFu: false,
            isYakuman: false,
            name: I18n.ja.yaku[DaiSushi.name],
          },
        ]);
      });
    });
  });
});
