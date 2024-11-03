import "../../../Utilities/Utilities";
import { describe, expect, test } from "vitest";
import { Mahjong } from "../../../Runtime/Mahjong";
import { PaiGenerator } from "../../../Utilities/PaiGenerator";
import I18n from "../../../Lang/I18n";
import { KokushiMusou13MenMachi } from "../../KokushiMusou13MenMachi";
import { MahjongDefaultAdditionalSpecialYaku } from "../../../Runtime/MahjongDefaultOption";

describe("KokushiMusou13MenMachi", () => {
  describe("fulfilled", () => {
    describe("parent", () => {
      test("tsumo", () => {
        const score = new Mahjong(
          [...PaiGenerator.generateKokushiMusou13MenMachi(), "1m"],
          {
            hora: {
              pai: "1m",
              fromTsumo: true,
              fromRon: false,

              fromRinshanPai: false,
            },

            additionalSpecialYaku: {
              ...MahjongDefaultAdditionalSpecialYaku,
              withKokushiMusou13MenMachi: true,
            },

            // NOTE: Here is same of a mahjong parent
            jikaze: "1z",
            kaze: "1z",
          },
        ).score.fourPlayerStyleScore;

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
            name: I18n.ja.yaku[KokushiMusou13MenMachi.name],
          },
        ]);
      });
      test("ron", () => {
        const score = new Mahjong(
          [...PaiGenerator.generateKokushiMusou13MenMachi(), "1m"],
          {
            hora: {
              pai: "1m",
              fromTsumo: false,
              fromRon: true,

              fromRinshanPai: false,
            },

            additionalSpecialYaku: {
              ...MahjongDefaultAdditionalSpecialYaku,
              withKokushiMusou13MenMachi: true,
            },

            // NOTE: Here is same of a mahjong parent
            jikaze: "1z",
            kaze: "1z",
          },
        ).score.fourPlayerStyleScore;

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
            name: I18n.ja.yaku[KokushiMusou13MenMachi.name],
          },
        ]);
      });
    });

    describe("child", () => {
      test("tsumo", () => {
        const score = new Mahjong(
          [...PaiGenerator.generateKokushiMusou13MenMachi(), "1m"],
          {
            hora: {
              pai: "1m",
              fromTsumo: true,
              fromRon: false,

              fromRinshanPai: false,
            },

            additionalSpecialYaku: {
              ...MahjongDefaultAdditionalSpecialYaku,
              withKokushiMusou13MenMachi: true,
            },

            jikaze: "2z",
            kaze: "1z",
          },
        ).score.fourPlayerStyleScore;

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
            name: I18n.ja.yaku[KokushiMusou13MenMachi.name],
          },
        ]);
      });
      test("ron", () => {
        const score = new Mahjong(
          [...PaiGenerator.generateKokushiMusou13MenMachi(), "1m"],
          {
            hora: {
              pai: "1m",
              fromTsumo: false,
              fromRon: true,

              fromRinshanPai: false,
            },

            additionalSpecialYaku: {
              ...MahjongDefaultAdditionalSpecialYaku,
              withKokushiMusou13MenMachi: true,
            },

            jikaze: "2z",
            kaze: "1z",
          },
        ).score.fourPlayerStyleScore;

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
            name: I18n.ja.yaku[KokushiMusou13MenMachi.name],
          },
        ]);
      });
    });
  });
});
