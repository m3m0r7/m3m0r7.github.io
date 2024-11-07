import "../../../Utilities/Utilities";
import { describe, expect, test } from "vitest";
import { Mahjong } from "../../../Runtime/Mahjong";
import I18n from "../../../Lang/I18n";
import { PaiName } from "../../../@types/types";
import { KazoeYakuman } from "../../KazoeYakuman";

const kazoeYakumanExampleFormat: PaiName[] = [
  "1m",
  "2m",
  "3m",
  "4m",
  "5m",
  "6m",

  "1p",
  "2p",
  "3p",
  "4p",
  "5p",
  "6p",

  "6z",
  "6z",
];

describe("KazoeYakuman", () => {
  describe("fulfilled", () => {
    describe("parent", () => {
      test("tsumo", () => {
        const score = new Mahjong(kazoeYakumanExampleFormat, {
          hora: {
            pai: "1m",
            fromTsumo: true,
            fromRon: false,

            fromRinshanPai: false,
          },

          doraList: kazoeYakumanExampleFormat,

          // NOTE: Here is same of a mahjong parent
          jikaze: "1z",
          kaze: "1z",
        }).calculator.value;

        expect(score?.score).deep.eq({ base: 48000, child: 16000 });
        expect(score?.honba).eq(0);
        expect(score?.fu).eq(null);
        expect(score?.yaku).eq("FULL");
        expect(score?.appliedFuList).deep.eq([]);
        expect(score?.appliedYakuList).deep.eq([
          {
            isDoubleYakuman: false,
            isFu: false,
            isYakuman: true,
            name: I18n.ja.yaku[KazoeYakuman.name],
          },
        ]);
      });
      test("ron", () => {
        const score = new Mahjong(kazoeYakumanExampleFormat, {
          hora: {
            pai: "1m",
            fromTsumo: false,
            fromRon: true,

            fromRinshanPai: false,
          },

          doraList: kazoeYakumanExampleFormat,

          // NOTE: Here is same of a mahjong parent
          jikaze: "1z",
          kaze: "1z",
        }).calculator.value;

        expect(score?.score).deep.eq({ base: 48000 });
        expect(score?.honba).eq(0);
        expect(score?.fu).eq(null);
        expect(score?.yaku).eq("FULL");
        expect(score?.appliedFuList).deep.eq([]);
        expect(score?.appliedYakuList).deep.eq([
          {
            isDoubleYakuman: false,
            isFu: false,
            isYakuman: true,
            name: I18n.ja.yaku[KazoeYakuman.name],
          },
        ]);
      });
    });

    describe("child", () => {
      test("tsumo", () => {
        const score = new Mahjong(kazoeYakumanExampleFormat, {
          hora: {
            pai: "1m",
            fromTsumo: true,
            fromRon: false,

            fromRinshanPai: false,
          },

          doraList: kazoeYakumanExampleFormat,

          jikaze: "2z",
          kaze: "1z",
        }).calculator.value;

        expect(score?.score).deep.eq({
          base: 32000,
          parent: 16000,
          child: 8000,
        });
        expect(score?.honba).eq(0);
        expect(score?.fu).eq(null);
        expect(score?.yaku).eq("FULL");
        expect(score?.appliedFuList).deep.eq([]);
        expect(score?.appliedYakuList).deep.eq([
          {
            isDoubleYakuman: false,
            isFu: false,
            isYakuman: true,
            name: I18n.ja.yaku[KazoeYakuman.name],
          },
        ]);
      });
      test("ron", () => {
        const score = new Mahjong(kazoeYakumanExampleFormat, {
          hora: {
            pai: "1m",
            fromTsumo: false,
            fromRon: true,

            fromRinshanPai: false,
          },

          doraList: kazoeYakumanExampleFormat,

          jikaze: "2z",
          kaze: "1z",
        }).calculator.value;

        expect(score?.score).deep.eq({ base: 32000 });
        expect(score?.honba).eq(0);
        expect(score?.fu).eq(null);
        expect(score?.yaku).eq("FULL");
        expect(score?.appliedFuList).deep.eq([]);
        expect(score?.appliedYakuList).deep.eq([
          {
            isDoubleYakuman: false,
            isFu: false,
            isYakuman: true,
            name: I18n.ja.yaku[KazoeYakuman.name],
          },
        ]);
      });
    });
  });
});
