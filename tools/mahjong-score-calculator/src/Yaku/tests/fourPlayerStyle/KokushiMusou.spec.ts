import "../../../Utilities/Utilities";
import { describe, expect, test } from "vitest";
import { Mahjong } from "../../../Runtime/Mahjong";
import I18n from "../../../Lang/I18n";
import { PaiName } from "../../../@types/types";
import { KokushiMusou } from "../../KokushiMusou";
import { PaiGenerator } from "../../../Utilities/PaiGenerator";

describe("KokushiMusou", () => {
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

            // NOTE: Here is same of a mahjong parent
            jikaze: "1z",
            kaze: "1z",
          },
        ).score.fourPlayerStyleScore;

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
            name: I18n.ja.yaku[KokushiMusou.name],
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

            // NOTE: Here is same of a mahjong parent
            jikaze: "1z",
            kaze: "1z",
          },
        ).score.fourPlayerStyleScore;

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
            name: I18n.ja.yaku[KokushiMusou.name],
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

            jikaze: "2z",
            kaze: "1z",
          },
        ).score.fourPlayerStyleScore;

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
            name: I18n.ja.yaku[KokushiMusou.name],
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

            jikaze: "2z",
            kaze: "1z",
          },
        ).score.fourPlayerStyleScore;

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
            name: I18n.ja.yaku[KokushiMusou.name],
          },
        ]);
      });
    });
  });
});
