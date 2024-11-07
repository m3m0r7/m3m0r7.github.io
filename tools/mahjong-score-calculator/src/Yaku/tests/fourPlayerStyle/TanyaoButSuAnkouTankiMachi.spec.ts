import "../../../Utilities/Utilities";
import { describe, expect, test } from "vitest";
import { Mahjong } from "../../../Runtime/Mahjong";
import I18n from "../../../Lang/I18n";
import { PaiName } from "../../../@types/types";
import { SuAnkouTankiMachi } from "../../SuAnkouTankiMachi";

const tanyaoButSuAnkouTankiMachiExampleFormat: PaiName[] = [
  "2m",
  "3m",
  "4m",

  "2m",
  "3m",
  "4m",

  "2m",
  "3m",
  "4m",

  "2p",
  "2p",
  "2p",

  "5m",
  "5m",
];

describe("SuAnkouTankiMachi", () => {
  describe("fulfilled", () => {
    describe("parent", () => {
      test("tsumo", () => {
        const score = new Mahjong(tanyaoButSuAnkouTankiMachiExampleFormat, {
          hora: {
            pai: "5m",
            fromTsumo: true,
            fromRon: false,

            fromRinshanPai: false,
          },

          // NOTE: Here is same of a mahjong parent
          jikaze: "1z",
          kaze: "1z",
        }).score.fourPlayerStyleScore;

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
            name: I18n.ja.yaku[SuAnkouTankiMachi.name],
          },
        ]);
      });
      test("ron", () => {
        const score = new Mahjong(tanyaoButSuAnkouTankiMachiExampleFormat, {
          hora: {
            pai: "5m",
            fromTsumo: false,
            fromRon: true,

            fromRinshanPai: false,
          },

          // NOTE: Here is same of a mahjong parent
          jikaze: "1z",
          kaze: "1z",
        }).score.fourPlayerStyleScore;

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
            name: I18n.ja.yaku[SuAnkouTankiMachi.name],
          },
        ]);
      });
    });

    describe("child", () => {
      test("tsumo", () => {
        const score = new Mahjong(tanyaoButSuAnkouTankiMachiExampleFormat, {
          hora: {
            pai: "5m",
            fromTsumo: true,
            fromRon: false,

            fromRinshanPai: false,
          },

          jikaze: "2z",
          kaze: "1z",
        }).score.fourPlayerStyleScore;

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
            name: I18n.ja.yaku[SuAnkouTankiMachi.name],
          },
        ]);
      });
      test("ron", () => {
        const score = new Mahjong(tanyaoButSuAnkouTankiMachiExampleFormat, {
          hora: {
            pai: "5m",
            fromTsumo: false,
            fromRon: true,

            fromRinshanPai: false,
          },

          jikaze: "2z",
          kaze: "1z",
        }).score.fourPlayerStyleScore;

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
            name: I18n.ja.yaku[SuAnkouTankiMachi.name],
          },
        ]);
      });
    });
  });
});
